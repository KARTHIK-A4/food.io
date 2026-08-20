import React, { useState } from 'react'

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onCompleteOrder
}) {
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState('Dine-In Table')
  const [tableNumber, setTableNumber] = useState('Table 4')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('gpay') // 'gpay' | 'cash'
  const [gpayUpiId, setGpayUpiId] = useState('customer@okaxis')
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const grandTotal = subtotal

  const handlePayNow = (e) => {
    e.preventDefault()
    if (!customerName.trim()) {
      setValidationError('Please enter your name.')
      return
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setValidationError('Please enter a valid phone number.')
      return
    }
    setValidationError('')
    setIsProcessing(true)

    // Simulate realistic payment verification
    setTimeout(() => {
      const now = new Date()
      const newOrder = {
        orderId: 'AROMA-' + Math.floor(100000 + Math.random() * 900000),
        date: now.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        timestamp: now.getTime(),
        day: now.getDate(),
        month: now.getMonth() + 1,
        monthName: now.toLocaleString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        isoDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        customer: {
          name: customerName,
          phone: phone,
          orderType: orderType,
          tableOrAddress: orderType === 'Dine-In Table' ? tableNumber : (orderType === 'Delivery' ? deliveryAddress : 'Counter Pickup')
        },
        items: [...cartItems],
        subtotal: subtotal,
        gst: 0,
        grandTotal: grandTotal,
        paymentMethod: paymentMethod === 'gpay' ? 'Google Pay (UPI)' : 'Cash at Counter',
        paymentStatus: 'PAID',
        upiRef: paymentMethod === 'gpay' ? 'UPI-GPAY-' + Math.random().toString(36).substring(2, 9).toUpperCase() : 'CASH-REC-' + Math.floor(1000 + Math.random() * 9000)
      }

      setIsProcessing(false)
      onCompleteOrder(newOrder)
    }, 1500)
  }

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-title-wrap">
            <span className="checkout-icon">💳</span>
            <div>
              <h3>Secure Checkout & Payment</h3>
              <p>Complete your order with Google Pay or Cash</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose} disabled={isProcessing}>
            ✕
          </button>
        </div>

        {validationError && (
          <div className="checkout-error-banner">
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handlePayNow} className="checkout-form-grid">
          {/* Left Column: Customer & Dining Details */}
          <div className="checkout-col">
            <h4 className="col-heading">1. Customer & Dining Details</h4>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Dining Mode</label>
              <div className="order-type-tabs">
                <button
                  type="button"
                  className={`type-tab ${orderType === 'Dine-In Table' ? 'active' : ''}`}
                  onClick={() => setOrderType('Dine-In Table')}
                >
                  🍽️ Dine-In
                </button>
                <button
                  type="button"
                  className={`type-tab ${orderType === 'Takeaway Counter' ? 'active' : ''}`}
                  onClick={() => setOrderType('Takeaway Counter')}
                >
                  🛍️ Takeaway
                </button>
                <button
                  type="button"
                  className={`type-tab ${orderType === 'Delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('Delivery')}
                >
                  🛵 Delivery
                </button>
              </div>
            </div>

            {orderType === 'Dine-In Table' && (
              <div className="form-group">
                <label>Table Number / Zone</label>
                <select 
                  value={tableNumber} 
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="form-input"
                >
                  <option value="Table 1 (Indoor AC)">Table 1 (Indoor AC)</option>
                  <option value="Table 2 (Indoor AC)">Table 2 (Indoor AC)</option>
                  <option value="Table 3 (Window View)">Table 3 (Window View)</option>
                  <option value="Table 4 (Garden Terrace)">Table 4 (Garden Terrace)</option>
                  <option value="Table 5 (Balcony)">Table 5 (Balcony)</option>
                </select>
              </div>
            )}

            {orderType === 'Delivery' && (
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea 
                  placeholder="Enter street, building, flat number"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows="2"
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Right Column: Payment Options */}
          <div className="checkout-col">
            <h4 className="col-heading">2. Choose Payment Method</h4>

            {/* Payment Method Selector */}
            <div className="payment-options-grid">
              {/* Google Pay Option */}
              <div 
                className={`payment-card ${paymentMethod === 'gpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('gpay')}
              >
                <div className="pay-radio-header">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'gpay'} 
                    onChange={() => setPaymentMethod('gpay')} 
                  />
                  <span className="pay-title">
                    <span className="gpay-logo-badge">G Pay</span> Google Pay (Instant UPI)
                  </span>
                </div>
                <p className="pay-sub">Pay securely using GPay App or QR code scanner</p>

                {paymentMethod === 'gpay' && (
                  <div className="gpay-details-box">
                    <div className="qr-sim-box">
                      <div className="qr-code-graphic">
                        <div className="qr-box-pattern"></div>
                        <span>[ GPay UPI QR ]</span>
                      </div>
                      <div className="qr-text">
                        <p><strong>Scan & Pay ₹{grandTotal.toFixed(2)}</strong></p>
                        <small>UPI ID: aromacafe@okaxis</small>
                      </div>
                    </div>

                    <div className="upi-input-group">
                      <label>Or Pay with your UPI ID:</label>
                      <input 
                        type="text" 
                        value={gpayUpiId}
                        onChange={(e) => setGpayUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="form-input mini"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash Option */}
              <div 
                className={`payment-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="pay-radio-header">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'cash'} 
                    onChange={() => setPaymentMethod('cash')} 
                  />
                  <span className="pay-title">
                    💵 Cash (Counter / Delivery)
                  </span>
                </div>
                <p className="pay-sub">Pay with physical cash upon receiving your order</p>
                {paymentMethod === 'cash' && (
                  <div className="cash-notice-box">
                    <p>✓ Instant receipt generated</p>
                    <p>✓ Please keep exact change of <strong>₹{grandTotal.toFixed(2)}</strong> ready at the counter.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total Overview */}
            <div className="checkout-summary-box">
              <div className="checkout-sum-row">
                <span>Items ({cartItems.length}):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-sum-row total">
                <span>Grand Total to Pay:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`btn-complete-pay ${paymentMethod === 'gpay' ? 'btn-gpay-theme' : 'btn-cash-theme'}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="processing-spinner-row">
                  <span className="spinner"></span> Processing Payment...
                </span>
              ) : (
                <>
                  {paymentMethod === 'gpay' ? '⚡ Pay with GPay (₹' + grandTotal.toFixed(2) + ')' : '💵 Confirm Cash Order (₹' + grandTotal.toFixed(2) + ')'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
