const express = require('express');
const { createOrder, placeOrder, cancelOrder,getMyOrders } = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/orders
router.post('/', verifyToken, createOrder);

router.get('/my', verifyToken, getMyOrders);

// PUT /api/orders/:orderId/checkout
router.put('/:orderId/checkout', verifyToken, checkRole(['admin', 'manager']), placeOrder);

// DELETE /api/orders/:orderId
router.delete('/:orderId', verifyToken, checkRole(['admin', 'manager']), cancelOrder);

module.exports = router;