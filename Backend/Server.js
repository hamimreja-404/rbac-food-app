const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const testRoutes = require('./src/routes/testRoutes');
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'RBAC Food Delivery API is up and running!' 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `API Endpoint Not Found: ${req.originalUrl}` 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server initialized on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`  Strict RBAC & Country constraints enabled.`);
});
