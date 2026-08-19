import React, { useState } from 'react'

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [sugarOption, setSugarOption] = useState('Medium Sugar')
  const [isAddedAnimation, setIsAddedAnimation] = useState(false)

  const handleAdd = () => {
    onAddToCart(product, quantity, sugarOption)
    setIsAddedAnimation(true)
    setTimeout(() => setIsAddedAnimation(false), 1200)
  }

  const isHot = product.category === 'hot'

  return (
    <div className={`coffee-card-premium ${isHot ? 'card-hot-theme' : 'card-cold-theme'}`}>
      {/* Top Banner Tag */}
      <div className="card-top-badges">
        <span className={`badge-type ${isHot ? 'badge-hot' : 'badge-cold'}`}>
          {isHot ? '☕ Warm Brew' : '🧊 Chilled Cooler'}
        </span>
        {product.badge && (
          <span className="badge-highlight">
            {product.badge}
          </span>
        )}
      </div>

      {/* Image Container with Zoom & Prep Time */}
      <div className="card-image-wrap">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-real-img"
          loading="lazy"
        />
        <div className="prep-time-tag">
          ⏱️ {product.prepTime}
        </div>
      </div>

      {/* Product Information */}
      <div className="card-body">
        <div className="card-rating-row">
          <span className="stars">★★★★★</span>
          <span className="rating-score">{product.rating}</span>
          <span className="rating-reviews">({product.reviews} reviews)</span>
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {/* Tags */}
        <div className="product-tags">
          {product.tags?.map((tag, idx) => (
            <span key={idx} className="tag-pill">#{tag}</span>
          ))}
        </div>

        {/* Customization Options */}
        <div className="card-customization">
          <label className="custom-label">Sweetness:</label>
          <select 
            value={sugarOption} 
            onChange={(e) => setSugarOption(e.target.value)}
            className="sugar-select"
          >
            <option value="Regular Sugar">Regular Sweet</option>
            <option value="Less Sugar">Less Sweet</option>
            <option value="Zero Sugar / Jaggery">Zero Sugar / Jaggery</option>
            <option value="Extra Strong">Extra Strong</option>
          </select>
        </div>

        {/* Price and Action Footer */}
        <div className="card-action-footer">
          <div className="price-stack">
            <div className="current-price">₹{product.price}</div>
            {product.originalPrice && (
              <div className="original-price">₹{product.originalPrice}</div>
            )}
          </div>

          <div className="qty-action-group">
            <div className="qty-stepper">
              <button 
                type="button" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-display">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button 
              className={`add-to-cart-btn ${isAddedAnimation ? 'added-success' : ''}`}
              onClick={handleAdd}
            >
              {isAddedAnimation ? '✓ Added!' : 'Add to Cart +'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
