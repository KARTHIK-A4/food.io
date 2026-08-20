import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Use MONGODB_URI from environment
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/coffeeshop_db'

app.use(cors())
app.use(express.json())

// Order Schema & Model
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  timestamp: { type: Number, required: true },
  day: { type: Number },
  month: { type: Number },
  monthName: { type: String },
  year: { type: Number },
  isoDate: { type: String },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    orderType: { type: String },
    tableOrAddress: { type: String }
  },
  items: [
    {
      id: String,
      name: String,
      category: String,
      price: Number,
      quantity: Number,
      customization: String,
      image: String,
      cartItemId: String
    }
  ],
  subtotal: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'PAID' },
  upiRef: { type: String }
}, {
  timestamps: true,
  collection: 'orders'
})

const Order = mongoose.model('Order', orderSchema)

// Connect to MongoDB Atlas
console.log('Connecting to MongoDB Atlas...')
const mongooseOptions = {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
}

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas (coffeeshop_db)')
    const count = await Order.countDocuments()
    console.log(`Current orders in database: ${count}`)
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas Connection Error:', err.message)
  })

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose Connection Error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost.')
})

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB connection restored.')
})

// Health / Status Route
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1
  res.json({
    status: isConnected ? 'connected' : 'disconnected',
    database: mongoose.connection.name || 'coffeeshop_db',
    readyState: mongoose.connection.readyState
  })
})

// GET all orders sorted by newest first
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to retrieve orders' })
  }
})

// POST create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body
    console.log(`📝 Received new order to save in MongoDB: ${orderData.orderId}`)
    
    // Check if orderId exists
    const existing = await Order.findOne({ orderId: orderData.orderId })
    if (existing) {
      return res.status(200).json(existing)
    }

    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    console.log(`✅ Saved order ${savedOrder.orderId} to MongoDB Atlas collection 'orders'`)
    res.status(201).json(savedOrder)
  } catch (error) {
    console.error('Error saving order to MongoDB:', error)
    res.status(500).json({ error: error.message || 'Failed to save order' })
  }
})

// DELETE all orders (clear history)
app.delete('/api/orders', async (req, res) => {
  try {
    await Order.deleteMany({})
    console.log('🗑️ All order history cleared from MongoDB Atlas')
    res.json({ message: 'All orders cleared successfully' })
  } catch (error) {
    console.error('Error clearing orders:', error)
    res.status(500).json({ error: 'Failed to clear orders' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
