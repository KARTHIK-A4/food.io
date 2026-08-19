import { useState, useEffect } from 'react'
import './App.css'
import { coffeeMenu } from './data/menuData'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import ReceiptModal from './components/ReceiptModal'
import OrderHistoryView from './components/OrderHistoryView'

function App() {
  // Navigation State: strictly 'home', 'hot', 'cold', 'history'
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterTag, setActiveFilterTag] = useState('ALL')

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aroma_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  // Order History State (Persisted in localStorage)
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('aroma_order_history')
      return savedHistory ? JSON.parse(savedHistory) : []
    } catch {
      return []
    }
  })

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // Fetch initial orders from MongoDB Atlas backend on mount
  useEffect(() => {
    const fetchMongoOrders = async () => {
      try {
        const res = await fetch('/api/orders')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setOrderHistory(data)
          }
        }
      } catch (err) {
        console.warn('MongoDB API not reachable yet, fallback to localStorage:', err)
      }
    }
    fetchMongoOrders()
  }, [])

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('aroma_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Sync Order History to localStorage
  useEffect(() => {
    localStorage.setItem('aroma_order_history', JSON.stringify(orderHistory))
  }, [orderHistory])

  // Show Toast Message helper
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3200)
  }

  // Add Item to Cart
  const handleAddToCart = (product, quantity = 1, customization = 'Regular Sweet') => {
    const cartItemId = `${product.id}-${customization}`
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId)
      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      } else {
        return [
          ...prevItems,
          {
            ...product,
            cartItemId,
            quantity,
            customization
          }
        ]
      }
    })
    triggerToast(`Added ${quantity}x ${product.name} to Cart! 🛒`)
  }

  // Update Cart Quantity
  const handleUpdateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId)
      return
    }
    setCartItems(prev =>
      prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item)
    )
  }

  // Remove Item from Cart
  const handleRemoveCartItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
    triggerToast('Item removed from cart.')
  }

  // Clear Cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      setCartItems([])
      triggerToast('Cart cleared.')
    }
  }

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  // Complete Order & Save to MongoDB Atlas
  const handleCompleteOrder = async (newOrder) => {
    // Add to local state & localStorage first
    setOrderHistory(prev => [newOrder, ...prev])
    // Clear cart
    setCartItems([])
    // Close checkout
    setIsCheckoutOpen(false)
    // Show Receipt
    setActiveReceiptOrder(newOrder)

    // Save to MongoDB Atlas database
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      if (res.ok) {
        triggerToast('✅ Order placed & saved to MongoDB Atlas!')
      } else {
        triggerToast('🎉 Order placed successfully!')
      }
    } catch (err) {
      console.warn('Saved locally. MongoDB API sync warning:', err)
      triggerToast('🎉 Order placed successfully!')
    }
  }

  // Reorder from History
  const handleReorder = (items) => {
    items.forEach(item => {
      handleAddToCart(item, item.quantity, item.customization || 'Regular Sweet')
    })
    setIsCartOpen(true)
    triggerToast('All items added to cart!')
  }

  // Clear Order History
  const handleClearHistory = async () => {
    if (window.confirm('Do you want to permanently clear your order history?')) {
      setOrderHistory([])
      localStorage.removeItem('aroma_order_history')
      try {
        await fetch('/api/orders', { method: 'DELETE' })
        triggerToast('Order history cleared from MongoDB & local storage.')
      } catch (err) {
        triggerToast('Order history cleared.')
      }
    }
  }

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Filtered menu lists
  const hotCoffees = coffeeMenu.filter(item => item.category === 'hot')
  const coldCoffees = coffeeMenu.filter(item => item.category === 'cold')
  
  // Featured items for Hero
  const heroHot = coffeeMenu.find(item => item.id === 'hot-1')
  const heroCold = coffeeMenu.find(item => item.id === 'cold-1')

  // Search and Tag filtering
  const filterList = (list) => {
    return list.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchTag = 
        activeFilterTag === 'ALL' || 
        item.tags.some(t => t.toUpperCase() === activeFilterTag) ||
        (activeFilterTag === 'BESTSELLER' && (item.badge?.includes('Bestseller') || item.badge?.includes('Trending')))

      return matchSearch && matchTag
    })
  }

  return (
    <div className="app-container">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation (Home, Hot Coffee, Cold Coffee, History, My Cart) */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        orderHistoryCount={orderHistory.length}
      />

      {/* PAGE 1: HOME PAGE */}
      {currentPage === 'home' && (
        <main className="page-wrapper">
          {/* Hero Section */}
          <HeroSection 
            onNavigate={(page) => setCurrentPage(page)}
            onQuickAdd={(item) => handleAddToCart(item, 1, 'Regular Sweet')}
            featuredHot={heroHot}
            featuredCold={heroCold}
          />

          {/* Quick Categories Navigation Cards */}
          <section className="quick-categories-section">
            <div className="quick-cat-grid">
              <div className="quick-cat-card hot-cat-card" onClick={() => setCurrentPage('hot')}>
                <div className="cat-card-bg-glow"></div>
                <div className="cat-icon-lg">☕</div>
                <h3>Hot Coffee & Teas</h3>
                <p>9 Traditional South Indian Kumbakonam Degree Brews & Herbal Teas</p>
                <span className="cat-cta-link">Explore Hot Menu →</span>
              </div>

              <div className="quick-cat-card cold-cat-card" onClick={() => setCurrentPage('cold')}>
                <div className="cat-card-bg-glow"></div>
                <div className="cat-icon-lg">🧊</div>
                <h3>Cold Coffee & Drinks</h3>
                <p>6 Slow-shaken Iced Coffees, Frappes & Refreshers</p>
                <span className="cat-cta-link">Explore Cold Menu →</span>
              </div>

              <div className="quick-cat-card history-cat-card" onClick={() => setCurrentPage('history')}>
                <div className="cat-card-bg-glow"></div>
                <div className="cat-icon-lg">🧾</div>
                <h3>Retail History & Receipts</h3>
                <p>Filter by Day & Month, view instant GPay / Cash receipts & reorder</p>
                <span className="cat-cta-link">View Order History →</span>
              </div>

              <div className="quick-cat-card cart-cat-card" onClick={() => setIsCartOpen(true)}>
                <div className="cat-card-bg-glow"></div>
                <div className="cat-icon-lg">🛒</div>
                <h3>My Shopping Cart</h3>
                <p>{cartCount} Items Selected • Total: ₹{cartTotal.toFixed(2)}</p>
                <span className="cat-cta-link">Open My Cart →</span>
              </div>
            </div>
          </section>

          {/* Home Featured: Top Hot & Cold Picks */}
          <section className="home-featured-picks">
            <div className="section-header-centered">
              <span className="section-eyebrow">✨ Handcrafted Favorites</span>
              <h2 className="section-title">Today's Trending Hot & Cold Brews</h2>
              <p className="section-subtitle">
                Click any coffee or cooler to customize sweetness, choose quantity, and add directly to your cart!
              </p>
            </div>

            <div className="products-grid-container">
              {coffeeMenu.slice(0, 6).map((item) => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="view-more-center">
              <button 
                className="btn-view-all-menu"
                onClick={() => setCurrentPage('hot')}
              >
                ☕ View Full Hot & Cold Menu ({coffeeMenu.length} Drinks)
              </button>
            </div>
          </section>

          {/* Why Choose Aroma Section */}
          <section className="home-perks-section">
            <div className="perks-grid">
              <div className="perk-box">
                <span className="perk-emoji">🌱</span>
                <h4>Estate Fresh Beans</h4>
                <p>100% shade-grown Arabica roasted in micro-batches every morning.</p>
              </div>
              <div className="perk-box">
                <span className="perk-emoji">🥛</span>
                <h4>Pure Farm Milk</h4>
                <p>Thick, unadulterated farm-fresh dairy for authentic degree froth.</p>
              </div>
              <div className="perk-box">
                <span className="perk-emoji">⚡</span>
                <h4>Instant GPay & Cash</h4>
                <p>Seamless tap-and-pay with digital receipts saved to your Day & Month history.</p>
              </div>
              <div className="perk-box">
                <span className="perk-emoji">🏆</span>
                <h4>Guaranteed Taste</h4>
                <p>Over 10,000+ positive customer ratings across our cafe locations.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* PAGE 2: HOT COFFEE MENU */}
      {currentPage === 'hot' && (
        <main className="page-wrapper">
          <div className="menu-header-banner hot-theme-banner">
            <div className="banner-content">
              <span className="banner-eyebrow">☕ Freshly Steamed & Brewed</span>
              <h1>Hot Coffee & Herbal Teas Selection</h1>
              <p>
                From authentic Kumbakonam Degree Filter Coffee to rich Royal Badam Milk and restorative Ginger Cardamom Chai.
              </p>
            </div>
          </div>

          {/* Filter and Search Controls */}
          <div className="menu-controls-row">
            <div className="search-bar-wrap">
              <span className="search-ico">🔍</span>
              <input 
                type="text" 
                placeholder="Search hot coffees, teas, ingredients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
            </div>
            <div className="tag-filter-buttons">
              <button 
                className={`tag-btn ${activeFilterTag === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveFilterTag('ALL')}
              >
                All Hot ({hotCoffees.length})
              </button>
              <button 
                className={`tag-btn ${activeFilterTag === 'BESTSELLER' ? 'active' : ''}`}
                onClick={() => setActiveFilterTag('BESTSELLER')}
              >
                ★ Bestsellers
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid-container">
            {filterList(hotCoffees).map(item => (
              <ProductCard 
                key={item.id} 
                product={item} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </main>
      )}

      {/* PAGE 3: COLD COFFEE MENU */}
      {currentPage === 'cold' && (
        <main className="page-wrapper">
          <div className="menu-header-banner cold-theme-banner">
            <div className="banner-content">
              <span className="banner-eyebrow">🧊 Chilled & Refreshing</span>
              <h1>Cold Coffees, Frappes & Coolers</h1>
              <p>
                Beat the heat with iced milk coffee, frosty chocolate frappes, chilled rose milk, and spiced buttermilk.
              </p>
            </div>
          </div>

          {/* Filter and Search Controls */}
          <div className="menu-controls-row">
            <div className="search-bar-wrap">
              <span className="search-ico">🔍</span>
              <input 
                type="text" 
                placeholder="Search cold coffee, frappes, rose milk..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
            </div>
            <div className="tag-filter-buttons">
              <button 
                className={`tag-btn ${activeFilterTag === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveFilterTag('ALL')}
              >
                All Cold ({coldCoffees.length})
              </button>
              <button 
                className={`tag-btn ${activeFilterTag === 'BESTSELLER' ? 'active' : ''}`}
                onClick={() => setActiveFilterTag('BESTSELLER')}
              >
                ★ Top Rated
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid-container">
            {filterList(coldCoffees).map(item => (
              <ProductCard 
                key={item.id} 
                product={item} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </main>
      )}

      {/* PAGE 4: ORDER HISTORY (WITH DAY & MONTH FILTERING) */}
      {currentPage === 'history' && (
        <main className="page-wrapper">
          <OrderHistoryView 
            orders={orderHistory}
            onOpenReceipt={(order) => setActiveReceiptOrder(order)}
            onReorder={handleReorder}
            onClearHistory={handleClearHistory}
            onNavigateHome={() => setCurrentPage('home')}
          />
        </main>
      )}

      {/* Floating Bottom Cart Bar for Quick Mobile Access */}
      {cartCount > 0 && !isCartOpen && !isCheckoutOpen && !activeReceiptOrder && (
        <div className="floating-cart-bar">
          <div className="floating-cart-content" onClick={() => setIsCartOpen(true)}>
            <div className="floating-cart-left">
              <span className="float-badge">{cartCount} items</span>
              <span className="float-total">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="floating-cart-right">
              <span>Open Cart & Checkout →</span>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer (My Cart) */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal (Google Pay / Cash) */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Digital Receipt Modal (Printable & Downloadable) */}
      <ReceiptModal 
        order={activeReceiptOrder}
        isOpen={Boolean(activeReceiptOrder)}
        onClose={() => setActiveReceiptOrder(null)}
        onViewHistory={() => {
          setActiveReceiptOrder(null)
          setCurrentPage('history')
        }}
        onOrderMore={() => {
          setActiveReceiptOrder(null)
          setCurrentPage('home')
        }}
      />

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col-brand">
            <div className="footer-logo">☕ AROMA COFFEE & ROASTERY</div>
            <p className="footer-tagline">
              Brewing authentic South Indian degree coffee, herbal teas, and artisan cold brews since 2010.
            </p>
            <div className="footer-badges">
              <span className="f-badge">✓ FSSAI Certified</span>
              <span className="f-badge">✓ 100% Pure Dairy</span>
              <span className="f-badge">✓ Instant GPay & Cash Support</span>
            </div>
          </div>

          <div className="footer-col-links">
            <h4>Menu Navigation</h4>
            <ul>
              <li><button onClick={() => setCurrentPage('home')}>🏠 Home</button></li>
              <li><button onClick={() => setCurrentPage('hot')}>☕ Hot Coffee</button></li>
              <li><button onClick={() => setCurrentPage('cold')}>🧊 Cold Coffee</button></li>
              <li><button onClick={() => setCurrentPage('history')}>🧾 Order History (Day & Month)</button></li>
              <li><button onClick={() => setIsCartOpen(true)}>🛒 My Cart ({cartCount})</button></li>
            </ul>
          </div>

          <div className="footer-col-contact">
            <h4>Cafe Timings & Contact</h4>
            <p>🕒 Mon - Sun: 6:00 AM – 11:00 PM</p>
            <p>📍 124 Coffee Boulevard, Roaster's Lane</p>
            <p>📞 Order Helpline: +91 98400 12345</p>
            <p>💳 Payment: Google Pay (UPI) & Cash Accepted</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Aroma Coffee Shop & Roastery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
