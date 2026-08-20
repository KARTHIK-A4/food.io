import React from 'react'

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) {
  if (!isOpen) return null

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const grandTotal = subtotal

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <span className="cart-header-emoji">🛍️</span>
            <h3>Your Coffee Cart</h3>
            <span className="cart-count-pill">{cartItems.length} items</span>
          </div>
          <button className="btn-close-drawer" onClick={onClose} aria-label="Close Cart">
            ✕
          </button>
        </div>

        {/* Cart Body */}
        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="empty-cart-icon">☕</div>
            <h4>Your cart is empty!</h4>
            <p>Looks like you haven't added any delicious coffees or teas yet.</p>
            <button className="btn-browse-menu" onClick={onClose}>
              Browse Coffee Menu
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-scroll">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="cart-item-row">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-thumb" 
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-opt">{item.customization}</div>
                    <div className="cart-item-rate">
                      ₹{item.price} × {item.quantity} = <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-qty-mini">
                        <button 
                          onClick={() => onUpdateQty(item.cartItemId, item.quantity - 1)}
                          className="qty-btn-mini"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.cartItemId, item.quantity + 1)}
                          className="qty-btn-mini"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        className="btn-trash-item"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        title="Remove item"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="cart-footer-summary">
              <div className="bill-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="bill-row free-row">
                <span>Packaging & Dine-in Service</span>
                <span className="free-tag">FREE ₹0</span>
              </div>
              <div className="bill-divider"></div>
              <div className="bill-row grand-total-row">
                <span>Total Amount</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <div className="cart-action-buttons">
                <button className="btn-clear-cart" onClick={onClearCart}>
                  Clear All
                </button>
                <button 
                  className="btn-checkout-primary"
                  onClick={onProceedToCheckout}
                >
                  Proceed to Checkout (₹{grandTotal.toFixed(2)}) →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
