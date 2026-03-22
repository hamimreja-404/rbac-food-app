const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// 1. Load Environment Variables
// This must happen before we initialize anything else so process.env is populated
dotenv.config();

// 2. Initialize Express Application
const app = express();

// 3. Global Middlewares
// Allow requests from your React frontend
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse incoming JSON payloads (req.body)
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// 4. Database Connection
// Connects to your MongoDB Atlas Cluster0
connectDB();

// 5. Import Modular Routes
const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const testRoutes = require('./src/routes/testRoutes');
// 6. Mount API Routes
// A simple health check route to verify the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: '🍕 RBAC Food Delivery API is up and running!' 
  });
});

// Mount the feature routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);
// 7. Global Error Handling
// Catch 404 - Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `API Endpoint Not Found: ${req.originalUrl}` 
  });
});

// Catch 500 - Internal Server Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 8. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server initialized on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`🛡️  Strict RBAC & Country constraints enabled.`);
});
