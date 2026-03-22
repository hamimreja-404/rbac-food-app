import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/api'; // Adjust path if needed

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMyOrders();
      
      // The Magic Fix: Safely unwrap the data whether it's nested or direct!
      const ordersArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      
      setOrders(ordersArray);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders automatically on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders // This allows us to reload data after a payment update!
  };
};