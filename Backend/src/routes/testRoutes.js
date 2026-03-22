const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// 1. Simple Server Ping
// Test this at: http://localhost:5000/api/test/ping
router.get('/ping', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: '🟢 Server is running perfectly!' 
  });
});

// 2. Check Database Connection Status
// Test this at: http://localhost:5000/api/test/db-status
router.get('/db-status', (req, res) => {
  const status = mongoose.connection.readyState;
  // Mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const statusMap = {
    0: 'Disconnected 🔴',
    1: 'Connected 🟢',
    2: 'Connecting 🟡',
    3: 'Disconnecting 🟠'
  };

  res.status(200).json({ 
    success: true, 
    database_status: statusMap[status] || 'Unknown' 
  });
});


//  http://localhost:5000/api/test/users
router.get('/users', async (req, res) => {
  try {
    
    const users = await User.find().select('-password'); 
    
    res.status(200).json({ 
      success: true, 
      count: users.length, 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// http://localhost:5000/api/test/restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    
    res.status(200).json({ 
      success: true, 
      count: restaurants.length, 
      data: restaurants 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;