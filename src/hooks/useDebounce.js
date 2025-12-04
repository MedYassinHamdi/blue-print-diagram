/**
 * useDebounce Hook
 *
 * Delays updating a value until a specified time has passed
 * without changes. Useful for search inputs and API calls.
 *
 * @author Yassin Hamdi
 * @module hooks/useDebounce
 */

import { useState, useEffect } from "react";

/**
 * Debounces a value by the specified delay.
 *
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
