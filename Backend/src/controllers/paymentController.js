// Admin ONLY
const updatePaymentMethod = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    
    // In a real app, this would interact with a Payment model or Stripe API
    // For this RBAC demo, we acknowledge the admin's action.

    res.status(200).json({ 
      success: true, 
      message: `Payment method for Order ${orderId} updated to ${paymentMethod} by Admin.` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment.' });
  }
};

module.exports = { updatePaymentMethod };