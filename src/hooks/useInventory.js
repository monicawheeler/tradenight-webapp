import { useState, useEffect, useCallback } from 'react';
import { updatePageStatus as updatePageStatusRequest } from '../lib/pageStatus';

const CACHE_KEY = 'trade_hub_cache';

const syncCache = (nextData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(nextData));
};

export const useInventory = () => {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(data.length === 0);

  useEffect(() => {
    fetch(import.meta.env.VITE_APPS_SCRIPT_URL)
      .then(res => res.json())
      .then(newData => {
        setData(newData);
        setLoading(false);
        syncCache(newData);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const updatePageStatus = useCallback(async (submissionId) => {
    console.log('[useInventory] updatePageStatus called', { submissionId });

    const result = await updatePageStatusRequest(submissionId);
    console.log('[useInventory] API response', { submissionId, result });

    // Check if the result is an array (returned by the Google Script) or has a truthy success property
    const isSuccess = Array.isArray(result) || result?.success;

    if (isSuccess) {
      setData((prev) => {
        // If the API returned the full updated array, use it directly! Otherwise fallback to local map
        const nextData = Array.isArray(result) 
          ? result 
          : prev.map((item) =>
              item['Submission ID']?.toString() === submissionId.toString()
                ? { ...item, Page_Status: 'PAGE' }
                : item
            );

        const match = nextData.find(
          (item) => item['Submission ID']?.toString() === submissionId.toString()
        );
        console.log('[useInventory] updating local state', {
          submissionId,
          matchedItem: match ? { id: match['Submission ID'], pageStatus: match.Page_Status } : null,
        });

        syncCache(nextData);
        return nextData;
      });
    } else {
      console.warn('[useInventory] update skipped — API did not return success', {
        submissionId,
        result,
      });
    }

    return result;
  }, []);

  return { data, loading, updatePageStatus };
};
