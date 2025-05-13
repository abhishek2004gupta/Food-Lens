const BASE_URL = "http://localhost:5001";

// Send product name (JSON) to Flask
export const getProductDetails = async (productName) => {
  try {
    const formData = new FormData();
    formData.append("product_name", productName);

    const response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Server returned error");
    }
    else {
      console.log("yes working")
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (err) {
    console.error("getProductDetails error:", err.message);
    alert("Failed to fetch product details. Check if backend is running.");
    return null;
  }
};

// Upload image (FormData) to Flask
export const uploadImage = async (imageFile) => {
  try {
    console.log("Starting image upload", imageFile);
    console.log("Image details:", {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    const formData = new FormData();
    
    // Ensure the image is properly formatted
    if (!imageFile.type.match('image/jpeg') && !imageFile.type.match('image/png')) {
      throw new Error("Please upload a JPEG or PNG image");
    }
    
    // Add the image to FormData with original quality
    formData.append("image", imageFile, imageFile.name);
    console.log("FormData created with image");

    const response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type, let the browser set it with the boundary
      }
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error("Image upload failed: " + errorText);
    }

    const data = await response.json();
    console.log("Server response:", data);
    
    // Check if the prediction was successful
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (err) {
    console.error("uploadImage error details:", err);
    alert(err.message || "Failed to upload image. Check if backend is running.");
    return null;
  }
};
