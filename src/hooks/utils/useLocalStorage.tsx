import { useState } from 'react';

type UseLocalStorageReturn<T> = readonly [T, (value: T | ((val: T) => T)) => void];

export const useLocalStorage = <T,>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Silently fail for localStorage errors
    }
  };

  return [storedValue, setValue] as const;
};
