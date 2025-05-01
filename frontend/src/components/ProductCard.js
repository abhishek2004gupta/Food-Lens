import React from 'react';
import '../styles/ProductCard.css'

function ProductCard({ productDetails }) {
  if (!productDetails) {
    return null;
  }

  const { product, health_score, good_ingredients, bad_ingredients } = productDetails;

  const getHealthColor = (percentage) => {
    if (percentage < 30) return 'red';
    if (percentage < 60) return 'yellow';
    return 'green';
  };

  return (
    <div className="product-card">
      <h2>{product}</h2>
      <div className="health-score">
        <div className="health-bar" style={{ backgroundColor: getHealthColor(health_score) }}>
          <p className='percentage'>{health_score}%</p>
        </div>
      </div>
      <div className="ingredients-section">
        <div>
          <h3>Good Ingredients</h3>
          <ul>
            {good_ingredients && good_ingredients.length > 0 ? good_ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>) : <li>No good ingredients found.</li>}
          </ul>
        </div>
        <div>
          <h3>Bad Ingredients</h3>
          <ul>
            {bad_ingredients && bad_ingredients.length > 0 ? bad_ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>) : <li>No bad ingredients found.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
