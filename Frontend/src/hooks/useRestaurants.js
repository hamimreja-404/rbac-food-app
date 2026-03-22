import { useState, useEffect, useCallback } from 'react';
import { restaurantAPI } from '../services/api';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]); 
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await restaurantAPI.getAll();
      
      setRestaurants(data.data || []); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
};

export const useRestaurant = (id) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchRestaurant = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await restaurantAPI.getOne(id);
      
      setRestaurant(data.data || data); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRestaurant(); }, [fetchRestaurant]);

  return { restaurant, loading, error, refetch: fetchRestaurant };
};