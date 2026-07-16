import { useState, useEffect } from 'react';

export const useInventory = () => {
  const [data, setData] = useState(() => {
    // Attempt to load from cache immediately
    const cached = localStorage.getItem('trade_hub_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(data.length === 0);

  useEffect(() => {
    fetch(import.meta.env.VITE_APPS_SCRIPT_URL)
      .then(res => res.json())
      .then(newData => {
        setData(newData);
        setLoading(false);
        // Save to cache for next time
        localStorage.setItem('trade_hub_cache', JSON.stringify(newData));
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return { data, loading };
};
