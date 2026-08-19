import React, { useState } from 'react'

export default function OrderHistoryView({
  orders,
  onOpenReceipt,
  onReorder,
  onClearHistory,
  onNavigateHome
}) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 1-12
  const currentDay = currentDate.getDate()

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState('ALL') // 'ALL' or '1'..'12'
  const [selectedDay, setSelectedDay] = useState('ALL')     // 'ALL' or '1'..'31'
  const [exactDateInput, setExactDateInput] = useState('')  // 'YYYY-MM-DD'
  const [filterPayment, setFilterPayment] = useState('ALL') // 'ALL' | 'GPAY' | 'CASH'
  const [searchQuery, setSearchQuery] = useState('')

  const monthsList = [
    { value: '1', name: 'January' },
    { value: '2', name: 'February' },
    { value: '3', name: 'March' },
    { value: '4', name: 'April' },
    { value: '5', name: 'May' },
    { value: '6', name: 'June' },
    { value: '7', name: 'July' },
    { value: '8', name: 'August' },
    { value: '9', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' },
  ]

  // Quick Preset Handlers
  const handleSetToday = () => {
    setSelectedMonth(String(currentMonth))
    setSelectedDay(String(currentDay))
    const todayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
    setExactDateInput(todayStr)
  }

  const handleSetThisMonth = () => {
    setSelectedMonth(String(currentMonth))
    setSelectedDay('ALL')
    setExactDateInput('')
  }

  const handleSetAllTime = () => {
    setSelectedMonth('ALL')
    setSelectedDay('ALL')
    setExactDateInput('')
    setSearchQuery('')
    setFilterPayment('ALL')
  }

  const handleDateInputChange = (e) => {
    const val = e.target.value
    setExactDateInput(val)
    if (val) {
      const parts = val.split('-')
      if (parts.length === 3) {
        setSelectedMonth(String(parseInt(parts[1], 10)))
        setSelectedDay(String(parseInt(parts[2], 10)))
      }
    } else {
      setSelectedMonth('ALL')
      setSelectedDay('ALL')
    }
  }

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    const orderTimestamp = order.timestamp || (order.date ? new Date(order.date).getTime() : Date.now())
    const oDate = new Date(orderTimestamp)
    const oDay = order.day || oDate.getDate()
    const oMonth = order.month || (oDate.getMonth() + 1)
    const oYear = order.year || oDate.getFullYear()
    const oIsoDate = order.isoDate || `${oYear}-${String(oMonth).padStart(2, '0')}-${String(oDay).padStart(2, '0')}`

    // Exact Date match
    if (exactDateInput && oIsoDate !== exactDateInput) {
      return false
    }

    // Month match
    if (selectedMonth !== 'ALL' && String(oMonth) !== String(selectedMonth)) {
      return false
    }

    // Day match
    if (selectedDay !== 'ALL' && String(oDay) !== String(selectedDay)) {
      return false
    }

    // Payment method match
    const matchesPayment = 
      filterPayment === 'ALL' || 
      (filterPayment === 'GPAY' && order.paymentMethod?.includes('Google Pay')) ||
      (filterPayment === 'CASH' && order.paymentMethod?.includes('Cash'))

    if (!matchesPayment) return false

    // Search query match
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      const matchesSearch = 
        order.orderId?.toLowerCase().includes(query) ||
        order.customer?.name?.toLowerCase().includes(query) ||
        order.items?.some(i => i.name.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    return true
  })

  // Filtered Summary Stats
  const filteredTotalSpent = filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)
  const filteredItemsCount = filteredOrders.reduce((sum, o) => sum + (o.items?.reduce((isum, i) => isum + i.quantity, 0) || 0), 0)

  // Label for active date filter
  const getFilterLabel = () => {
    if (exactDateInput) {
      return `Date: ${exactDateInput}`
    }
    if (selectedMonth !== 'ALL' && selectedDay !== 'ALL') {
      const mObj = monthsList.find(m => m.value === selectedMonth)
      return `${mObj ? mObj.name : 'Month ' + selectedMonth} Day ${selectedDay}`
    }
    if (selectedMonth !== 'ALL') {
      const mObj = monthsList.find(m => m.value === selectedMonth)
      return `${mObj ? mObj.name : 'Month ' + selectedMonth} (All Days)`
    }
    if (selectedDay !== 'ALL') {
      return `Day ${selectedDay} (All Months)`
    }
    return 'All Time History'
  }

  return (
    <section className="history-page-section">
      {/* Header Block */}
      <div className="history-header-block">
        <div className="history-header-left">
          <span className="section-eyebrow">📜 Retail Purchase Ledger</span>
          <h2 className="section-title">Order History by Day & Month</h2>
          <p className="section-subtitle">
            Enter or select any Day and Month to instantly view relevant coffee receipts, daily sales breakdown, and reorder favorites!
          </p>
        </div>
        {orders.length > 0 && (
          <button className="btn-clear-history-danger" onClick={onClearHistory}>
            🗑️ Clear Order History
          </button>
        )}
      </div>

      {/* Date & Month Selection Console */}
      <div className="history-date-filter-box">
        <div className="date-filter-header">
          <h4>📅 Enter Day & Month Filter</h4>
          <div className="date-presets-row">
            <button 
              type="button" 
              className={`preset-btn ${selectedMonth === 'ALL' && selectedDay === 'ALL' && !exactDateInput ? 'active' : ''}`}
              onClick={handleSetAllTime}
            >
              All Time
            </button>
            <button 
              type="button" 
              className={`preset-btn ${selectedMonth === String(currentMonth) && selectedDay === String(currentDay) ? 'active' : ''}`}
              onClick={handleSetToday}
            >
              ⚡ Today
            </button>
            <button 
              type="button" 
              className={`preset-btn ${selectedMonth === String(currentMonth) && selectedDay === 'ALL' ? 'active' : ''}`}
              onClick={handleSetThisMonth}
            >
              📆 This Month
            </button>
          </div>
        </div>

        <div className="date-filter-inputs-grid">
          {/* Month Selector */}
          <div className="date-field-col">
            <label>Select Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                setExactDateInput('')
              }}
              className="history-select-input"
            >
              <option value="ALL">All Months (Jan - Dec)</option>
              {monthsList.map(m => (
                <option key={m.value} value={m.value}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Day Selector */}
          <div className="date-field-col">
            <label>Select Day (1-31):</label>
            <select 
              value={selectedDay} 
              onChange={(e) => {
                setSelectedDay(e.target.value)
                setExactDateInput('')
              }}
              className="history-select-input"
            >
              <option value="ALL">All Days of Month</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={String(day)}>Day {day}</option>
              ))}
            </select>
          </div>

          {/* Exact Date Picker Input */}
          <div className="date-field-col">
            <label>Or Pick Specific Date:</label>
            <input 
              type="date" 
              value={exactDateInput}
              onChange={handleDateInputChange}
              className="history-date-picker-input"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="date-field-col">
            <label>Payment Method:</label>
            <select 
              value={filterPayment} 
              onChange={(e) => setFilterPayment(e.target.value)}
              className="history-select-input"
            >
              <option value="ALL">All Payments (GPay + Cash)</option>
              <option value="GPAY">⚡ Google Pay Only</option>
              <option value="CASH">💵 Cash Only</option>
            </select>
          </div>
        </div>

        {/* Search inside history */}
        <div className="history-search-row">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, or Coffee item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-inline-input"
          />
          {(selectedMonth !== 'ALL' || selectedDay !== 'ALL' || exactDateInput || searchQuery || filterPayment !== 'ALL') && (
            <button className="btn-reset-filters" onClick={handleSetAllTime}>
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Relevant Date & Month Metrics Overview Banner */}
      <div className="history-relevant-summary-banner">
        <div className="summary-left">
          <span className="summary-eyebrow">FILTERED SELECTION</span>
          <h3>{getFilterLabel()}</h3>
          <p className="summary-sub">Showing matching orders and transactions</p>
        </div>

        <div className="summary-stats-duo">
          <div className="stat-pill-box">
            <span className="stat-pill-label">Total Orders</span>
            <span className="stat-pill-value">{filteredOrders.length}</span>
          </div>
          <div className="stat-pill-box">
            <span className="stat-pill-label">Drinks Served</span>
            <span className="stat-pill-value">{filteredItemsCount}</span>
          </div>
          <div className="stat-pill-box highlight">
            <span className="stat-pill-label">Total Sales / Spend</span>
            <span className="stat-pill-value">₹{filteredTotalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Orders List / Empty States */}
      {orders.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-history-icon">📜</div>
          <h3>No Orders in History</h3>
          <p>You haven't placed any orders yet. Place an order on the Home, Hot Coffee, or Cold Coffee page to see your receipt saved here by Day and Month!</p>
          <button className="btn-order-now-cta" onClick={onNavigateHome}>
            ☕ Start Your First Order
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-history-icon">🔎</div>
          <h3>No Orders Found for {getFilterLabel()}</h3>
          <p>No orders were placed matching the selected Day, Month, or search query.</p>
          <button className="btn-order-now-cta" onClick={handleSetAllTime}>
            View All Recorded Orders ({orders.length})
          </button>
        </div>
      ) : (
        <div className="orders-list-grid">
          {filteredOrders.map((order) => {
            const isGPay = order.paymentMethod?.includes('Google Pay')
            return (
              <div key={order.orderId} className="order-history-card">
                {/* Header Row */}
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-hash">#{order.orderId}</span>
                    <span className="order-date">📅 {order.date}</span>
                  </div>
                  <div className={`order-badge ${isGPay ? 'badge-gpay' : 'badge-cash'}`}>
                    {isGPay ? '⚡ GPay Verified' : '💵 Cash Verified'}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="order-customer-row">
                  <span><strong>Customer:</strong> {order.customer?.name} ({order.customer?.phone})</span>
                  <span><strong>Mode:</strong> {order.customer?.orderType}</span>
                </div>

                {/* Items preview list */}
                <div className="order-items-preview">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-snippet">
                      <img src={item.image} alt={item.name} className="snippet-img" />
                      <div className="snippet-details">
                        <span className="snippet-name">{item.name}</span>
                        <span className="snippet-qty">Qty: {item.quantity} × ₹{item.price} ({item.customization})</span>
                      </div>
                      <span className="snippet-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total & Action Buttons */}
                <div className="order-card-footer">
                  <div className="order-total-price">
                    <span className="total-label">Grand Total:</span>
                    <span className="total-amount">₹{order.grandTotal?.toFixed(2)}</span>
                  </div>

                  <div className="order-btn-actions">
                    <button 
                      className="btn-view-receipt"
                      onClick={() => onOpenReceipt(order)}
                    >
                      🧾 View Full Receipt
                    </button>
                    <button 
                      className="btn-reorder-items"
                      onClick={() => onReorder(order.items)}
                    >
                      🔄 Reorder Items
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
