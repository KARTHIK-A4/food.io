import React from 'react'

export default function ReceiptModal({
  order,
  isOpen,
  onClose,
  onViewHistory,
  onOrderMore
}) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const isGPay = order.paymentMethod?.includes('Google Pay')

  return (
    <div className="receipt-backdrop" onClick={onClose}>
      <div className="receipt-container-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Floating Badge */}
        <div className="receipt-status-banner">
          <span className="success-check-icon">✓</span>
          <span>Order Confirmed & Paid Successfully!</span>
        </div>

        {/* The Printable Receipt Sheet */}
        <div className="receipt-sheet" id="printable-receipt">
          {/* Receipt Brand Header */}
          <div className="receipt-brand-header">
            <div className="receipt-logo">☕ AROMA CAFE & ROASTERY</div>
            <div className="receipt-sub">Artisanal Coffee, Brews & Beverages</div>
            <div className="receipt-meta-info">124 Coffee Boulevard, Roaster's Lane</div>
            <div className="receipt-meta-info">FSSAI Lic: 10023042000891 | Ph: +91 98400 12345</div>
            <div className="receipt-dashed-line">------------------------------------------------</div>
          </div>

          {/* Transaction Metadata */}
          <div className="receipt-meta-grid">
            <div className="meta-pair">
              <span className="meta-label">ORDER ID:</span>
              <strong className="meta-value-highlight">#{order.orderId}</strong>
            </div>
            <div className="meta-pair">
              <span className="meta-label">DATE & TIME:</span>
              <span className="meta-value">{order.date}</span>
            </div>
            <div className="meta-pair">
              <span className="meta-label">CUSTOMER:</span>
              <span className="meta-value">{order.customer.name} ({order.customer.phone})</span>
            </div>
            <div className="meta-pair">
              <span className="meta-label">DINING MODE:</span>
              <span className="meta-value">{order.customer.orderType} - {order.customer.tableOrAddress}</span>
            </div>
            <div className="meta-pair">
              <span className="meta-label">PAYMENT:</span>
              <span className={`payment-pill ${isGPay ? 'gpay-pill' : 'cash-pill'}`}>
                {order.paymentMethod} • {order.paymentStatus}
              </span>
            </div>
            <div className="meta-pair">
              <span className="meta-label">TXN REF:</span>
              <span className="meta-value code-font">{order.upiRef}</span>
            </div>
          </div>

          <div className="receipt-dashed-line">------------------------------------------------</div>

          {/* Itemized Table */}
          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>ITEM DESCRIPTION</th>
                <th style={{ textAlign: 'center' }}>QTY</th>
                <th style={{ textAlign: 'right' }}>RATE</th>
                <th style={{ textAlign: 'right' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="item-title">{item.name}</div>
                    <div className="item-sub-opt">{item.customization}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-dashed-line">------------------------------------------------</div>

          {/* Totals Section */}
          <div className="receipt-totals-table">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>GST (5%):</span>
              <span>₹{order.gst.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Packaging / Dining Fee:</span>
              <span>₹0.00</span>
            </div>
            <div className="total-row grand-total">
              <span>GRAND TOTAL PAID:</span>
              <span>₹{order.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-dashed-line">------------------------------------------------</div>

          {/* Barcode & Thank You */}
          <div className="receipt-footer-notes">
            <div className="receipt-barcode">
              ||| | ||||| |||| || ||||| ||| |||| |||||
            </div>
            <p className="thank-you-text">Thank you for brewing memories with Aroma Cafe!</p>
            <p className="review-prompt">Scan QR on counter or visit again for 10% off next visit.</p>
          </div>
        </div>

        {/* Action Controls for User */}
        <div className="receipt-actions-footer">
          <button className="btn-print-receipt" onClick={handlePrint}>
            🖨️ Print / Save PDF Receipt
          </button>
          <button className="btn-view-all-history" onClick={onViewHistory}>
            📜 View in Order History
          </button>
          <button className="btn-new-order" onClick={onOrderMore}>
            ☕ Order More Brews
          </button>
        </div>
      </div>
    </div>
  )
}
