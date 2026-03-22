const express = require('express');
const { getRestaurants,getRestaurantById } = require('../controllers/restaurantController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/restaurants
router.get('/', verifyToken, getRestaurants);

// GET /api/restaurants/:id
router.get('/:id', verifyToken, getRestaurantById);

router.get('/', verifyToken, getRestaurants);

module.exports = router;