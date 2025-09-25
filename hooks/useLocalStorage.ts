import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

// FIX: Resolved 'React' namespace error by explicitly importing Dispatch and SetStateAction types and updating the function's return type. The trailing comma in the generic parameter <T,> was also removed.
function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // This effect synchronizes the state with localStorage.
  // It runs after every render where `storedValue` has changed.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
             try {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
             } catch (error) {
                console.error(error);
                setStoredValue(initialValue);
             }
        }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue]);


  // Return the stateful value and the updater function from useState.
  // The updater function (`setStoredValue`) is stable and correctly handles
  // functional updates, which is what `MyBingos.tsx` uses to delete cards.
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
