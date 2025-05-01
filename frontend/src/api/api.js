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
    const formData = new FormData();
    formData.append("image", imageFile);
    console.log("FormData created with image");

    const response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      body: formData
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error("Image upload failed: " + errorText);
    }

    const data = await response.json();
    console.log("Server response:", data);
    return data;
  } catch (err) {
    console.error("uploadImage error details:", err);
    alert("Failed to upload image. Check if backend is running.");
    return null;
  }
};
