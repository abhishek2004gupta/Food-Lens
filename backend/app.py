from flask import Flask, request, jsonify
import pickle
import pandas as pd
import json
import numpy as np
from PIL import Image
import io
from tensorflow.keras.models import load_model
from flask_cors import CORS
import ast

app = Flask(__name__)
CORS(app)
# Load model and supporting files
model = load_model("model.keras")
print("Model input shape:", model.input_shape)
print("Model summary:")
model.summary()

with open("data_cat.pkl", "rb") as f:
    model.classes_ = pickle.load(f)

data = pd.read_csv("dataset.csv")
with open("ratings.json", "r") as f:
    ratings = json.load(f)


# Image preprocessing function (adapt to your model input size)
def preprocess_image(image_bytes):
    print("Starting image preprocessing")
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        print(f"Image opened successfully, size: {image.size}")
        
        # Calculate the target size based on model's input shape
        target_height = model.input_shape[1]
        target_width = model.input_shape[2]
        image = image.resize((target_width, target_height))
        print(f"Image resized to {target_width}x{target_height}")
        
        # Convert to array and normalize
        image_array = np.array(image) / 255.0
        print(f"Image array shape before reshape: {image_array.shape}")
            
        # Reshape according to model's input shape
        reshaped_array = image_array.reshape((1,) + model.input_shape[1:])
        print(f"Final image array shape: {reshaped_array.shape}")
        
        return reshaped_array
    except Exception as e:
        print(f"Error in image preprocessing: {str(e)}")
        raise e

def get_ingredients(product_name):
    print("Searching for product:", product_name)
    print("Available columns:", data.columns)
    
    # Normalize both sides
    data['Product Name'] = data['Product Name'].str.strip().str.lower()
    product_name = product_name.strip().lower()
    
    # Try exact match first
    row = data[data['Product Name'] == product_name]
    
    # If no exact match, try partial match
    if row.empty:
        print("No exact match found, trying partial match")
        # Try matching with the first word
        first_word = product_name.split()[0]
        row = data[data['Product Name'].str.contains(first_word, case=False, na=False)]
        print(f"Searching with first word: {first_word}")
        print(f"Matching rows found: {len(row)}")
    
    print("Row found:", row)
    if not row.empty:
        ingredients_str = row.iloc[0]['Ingredients']
        try:
            # Convert string to dictionary using ast.literal_eval for safety
            ingredients_dict = ast.literal_eval(ingredients_str)
            # Return list of ingredients with their percentages
            return [(key.strip().lower(), value) for key, value in ingredients_dict.items()]
        except:
            print("Failed to parse ingredients as dictionary")
            return []
    return []

# Get health score and categorize ingredients
def evaluate_ingredients(ingredients):
    good, bad = [], []
    total_weighted_healthiness = 0
    total_weightage = 0
    
    for ing, percentage in ingredients:
        print(f"Checking ingredient: {ing}")
        # Use partial matching for ratings
        found_rating = None
        for rating_key, rating_value in ratings.items():
            if ing.lower() in rating_key.lower() or rating_key.lower() in ing.lower():
                found_rating = rating_value
                break
                
        print(f"Rating found for {ing}: {found_rating}")
        
        if found_rating is not None:
            # Use the percentage (weightage) in health score calculation
            total_weighted_healthiness += percentage * found_rating
            total_weightage += percentage
            
            # Categorize based on rating threshold of 10
            if found_rating >= 10:
                good.append(f"{ing} ({percentage}%)")
            else:
                bad.append(f"{ing} ({percentage}%)")

    # Calculate health percentage using the weighted formula
    if total_weightage == 0:
        health_percentage = 0
    else:
        # Normalize healthiness score to 20 (maximum healthiness rating)
        healthiness_score = total_weighted_healthiness / total_weightage
        # Convert to percentage (out of 100%)
        health_percentage = (healthiness_score / 20) * 100
    
    print(f"Final scores - Total Weighted: {total_weighted_healthiness}, Total Weight: {total_weightage}, Percentage: {health_percentage}")
    return round(health_percentage, 2), good, bad

@app.route("/predict", methods=["POST"])
def predict():
    if "image" in request.files:
        print("Image file received")
        try:
            image = request.files["image"].read()
            print(f"Image size: {len(image)} bytes")
            
            processed_image = preprocess_image(image)
            print("Image preprocessed successfully")
            print(f"Processed image shape: {processed_image.shape}")
            
            prediction = model.predict(processed_image)
            print(f"Model prediction shape: {prediction.shape}")
            class_index = np.argmax(prediction)
            predicted_class = model.classes_[class_index]
            print(f"Raw predicted class: {predicted_class}")
            
            # Clean up predicted class name to match dataset format
            predicted_class = predicted_class.replace('_', ' ').lower()
            print(f"Cleaned predicted class: {predicted_class}")
            
            # Print all product names for debugging
            print("Available products in dataset:")
            print(list(data['Product Name'].str.lower()))
            
            ingredients = get_ingredients(predicted_class)
            print(f"Found ingredients: {ingredients}")
            
        except Exception as e:
            print(f"Error during image processing: {str(e)}")
            return jsonify({"error": str(e)}), 500
    elif "product_name" in request.form:
        product_name = request.form["product_name"]
        ingredients = get_ingredients(product_name)
        predicted_class = product_name
    else:
        return jsonify({"error": "No image or product name provided"}), 400

    if not ingredients:
        return jsonify({"error": "Product not found or no ingredients listed"}), 404

    health_score, good_ingredients, bad_ingredients = evaluate_ingredients(ingredients)
    print(f"Health evaluation complete - score: {health_score}")

    return jsonify({
        "product": predicted_class,
        "ingredients": ingredients,
        "good_ingredients": good_ingredients,
        "bad_ingredients": bad_ingredients,
        "health_score": health_score
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
