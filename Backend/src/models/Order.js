const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['saved', 'placed', 'cancelled'],
    default: 'placed'
  },
  country: {
    type: String,
    enum: ['India', 'America'],
    required: true
  },
  paymentMethod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);