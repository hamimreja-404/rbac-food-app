const express = require('express');
const { updatePaymentMethod } = require('../controllers/paymentController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// PUT /api/payment
router.put('/', verifyToken, checkRole(['admin']), updatePaymentMethod);

module.exports = router;