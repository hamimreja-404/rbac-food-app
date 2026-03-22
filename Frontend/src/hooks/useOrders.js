import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/api'; 

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMyOrders();
      
      const ordersArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      
      setOrders(ordersArray);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders 
  };
};