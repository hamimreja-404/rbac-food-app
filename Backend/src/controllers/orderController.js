const Order = require('../models/Order');

// All roles 
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      status: 'saved',
      country: req.user.country // Lock order to their country
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
};

// Admin and Manager ONLY 
const placeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body; 

    const order = await Order.findOneAndUpdate(
      { _id: orderId, country: req.user.country }, 
      { 
        status: 'placed',
        paymentMethod: paymentMethod || 'Corporate Card' 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pending order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order successfully placed!', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};


const getMyOrders = async (req, res) => {
  try {
    let filter = { country: req.user.country }; 
    
    if (req.user.role === 'member') {
      filter.userId = req.user.id; 
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Admin and Manager ONLY 
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, country: req.user.country },
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or access denied.' });
    }

    res.status(200).json({ success: true, message: 'Order cancelled.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};

module.exports = { createOrder, placeOrder, cancelOrder, getMyOrders };