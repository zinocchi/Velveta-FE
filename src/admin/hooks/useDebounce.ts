import { useState, useEffect } from 'react';

/**
 * Hook untuk debounce value
 * @param value - Nilai yang akan di-debounce
 * @param delay - Waktu tunggu dalam milidetik (default: 500ms)
 * @returns Nilai setelah debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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