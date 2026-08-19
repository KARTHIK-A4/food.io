import React from 'react'

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  cartCount, 
  cartTotal, 
  onOpenCart,
  orderHistoryCount 
}) {
  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setCurrentPage('home')}>
          <div className="logo-icon-wrap">
            <span className="logo-icon">☕</span>
            <span className="logo-sparkle">✨</span>
          </div>
          <div className="logo-text">
            <span className="brand-name">AROMA</span>
            <span className="brand-tagline">Artisanal Coffee & Roastery</span>
          </div>
        </div>

        {/* Navigation Links - Only Home, Hot Coffee, Cold Coffee, and History */}
        <nav className="desktop-nav">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'hot' ? 'active' : ''}`}
            onClick={() => setCurrentPage('hot')}
          >
            ☕ Hot Coffee
          </button>
          <button 
            className={`nav-link ${currentPage === 'cold' ? 'active' : ''}`}
            onClick={() => setCurrentPage('cold')}
          >
            🧊 Cold Coffee
          </button>
          <button 
            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentPage('history')}
          >
            🧾 History {orderHistoryCount > 0 && <span className="history-badge">{orderHistoryCount}</span>}
          </button>
        </nav>

        {/* My Cart Trigger */}
        <div className="header-actions">
          <button className="cart-trigger-btn" onClick={onOpenCart} aria-label="Open Shopping Cart">
            <div className="cart-icon-wrapper">
              <span className="cart-emoji">🛒</span>
              {cartCount > 0 && <span className="cart-badge-pulse">{cartCount}</span>}
            </div>
            <div className="cart-btn-info">
              <span className="cart-label">My Cart</span>
              <span className="cart-total-peek">₹{cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
