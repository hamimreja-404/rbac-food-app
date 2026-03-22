const Restaurant = require('../models/Restaurant');

const getRestaurants = async (req, res) => {
  try {

    const userCountry = req.user.country;

    // Fetch restaurants strictly matching the user's assigned country
    const restaurants = await Restaurant.find({ country: userCountry });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error('Fetch Restaurants Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants.' });
  }
};
const getRestaurantById = async (req, res) => {
  try {
    // Find the restaurant by ID, but strictly enforce the user's country!
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      country: req.user.country 
    });

    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found or is outside your allowed region.' 
      });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Fetch Single Restaurant Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant details.' });
  }
};
module.exports = { getRestaurants ,getRestaurantById };