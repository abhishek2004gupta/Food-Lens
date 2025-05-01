import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-page">
      <h2>About Healthy Food Checker</h2>
      <p>
        Welcome to Healthy Food Checker! We are dedicated to helping you make
        informed decisions about the food you consume. Our mission is to provide
        you with clear and concise information about the healthiness of various
        food products.
      </p>
      <p>
        Our application uses a combination of image recognition and ingredient
        analysis to determine the healthiness of food products. You can either
        upload an image of a food package or type the product name to get
        started.
      </p>
      <p>
        We believe that understanding what you eat is the first step towards
        a healthier lifestyle. Let us help you in your journey towards wellness!
      </p>
    </div>
  );
}

export default About;
