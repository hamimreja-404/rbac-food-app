const mongoose = require('mongoose');

// Sub-schema for menu items array
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, 
  price: { type: Number, required: true }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    enum: ['India', 'America'],
    required: true,
  },
  cuisine: {
    type: String,
    required: true, 
  },
  rating: {
    type: Number,
    default: 0,     
  },
  deliveryTime: {
    type: String,   
  },
  image:{
    type: String,
  },
  menu: [menuItemSchema] 
});

module.exports = mongoose.model('Restaurant', restaurantSchema);