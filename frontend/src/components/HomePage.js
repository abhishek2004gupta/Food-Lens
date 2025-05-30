import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { productList } from '../data/productList';
import '../styles/HomePage.css'
import { uploadImage, getProductDetails } from '../api/api';

function HomePage() {
  const [selectedOption, setSelectedOption] = useState('Type Product Name');
  const [productName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setProductDetails(null);
    setProductName('');
    setSelectedFile(null);
    setUploadedImageUrl(null);
  };

  const handleProductChange = (event) => {
    setProductName(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setUploadedImageUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      alert('Please upload a JPEG or PNG image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview without affecting original file
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImageUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Store original file
    setSelectedFile(file);
  };

  const normalizeDetails = (details) => ({
    product: details.product,
    health_score: details.health_score,
    good_ingredients: details.good_ingredients,
    bad_ingredients: details.bad_ingredients
  });

  const handleSubmit = async () => {
    setProductDetails(null);
    if (selectedOption === 'Type Product Name') {
      if (productName) {
        const details = await getProductDetails(productName);
        if (details) setProductDetails(normalizeDetails(details));
      } else {
        alert("Please select a product from the dropdown.");
      }
    } else if (selectedOption === 'Upload Image') {
      if (selectedFile) {
        // Create a copy of the file to ensure original quality
        const fileCopy = new File([selectedFile], selectedFile.name, {
          type: selectedFile.type
        });
        const details = await uploadImage(fileCopy);
        if (details) setProductDetails(normalizeDetails(details));
      } else {
        alert("Please upload an image.");
      }
    }
  };

  return (
    <div className="home-page">
      <h2 className='heading'>Check the Healthiness of Your Food</h2>
      <div className="input-section">
        <select value={selectedOption} onChange={handleOptionChange} className="select-input">
          <option value="Type Product Name">Type Product Name</option>
          <option value="Upload Image">Upload Image</option>
        </select>

        {selectedOption === 'Type Product Name' ? (
          <select value={productName} onChange={handleProductChange} className="select-input">
            <option value="">Select a product</option>
            {productList.map((product, index) => (
              <option key={index} value={product}>{product}</option>
            ))}
          </select>
        ) : (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            {uploadedImageUrl && (
              <img src={uploadedImageUrl} alt="Uploaded Product" className="uploaded-image" style={{ height: "200px", width: "200px" }} />
            )}
          </div>
        )}
        <button onClick={handleSubmit} className="check-button">Check Healthiness</button>
      </div>
      <div className='result-section'>
        {productDetails && <ProductCard productDetails={productDetails} />}
      </div>
    </div>
  );
}

export default HomePage;
