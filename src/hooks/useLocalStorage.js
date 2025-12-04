/**
 * useLocalStorage Hook
 *
 * Custom React hook for persisting state to localStorage.
 * Automatically syncs state changes with browser storage.
 *
 * @author Yassin Hamdi
 * @module hooks/useLocalStorage
 */

import { useState, useEffect } from "react";

/**
 * Persists state to localStorage with automatic sync.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {Array} [storedValue, setStoredValue] tuple
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
