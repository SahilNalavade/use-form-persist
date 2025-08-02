import { StorageAdapter } from '../types';

export const createStorageAdapter = (): StorageAdapter => {
  const isClient = typeof window !== 'undefined';
  const hasLocalStorage = isClient && 'localStorage' in window;

  const fallbackStorage = new Map<string, string>();

  return {
    getItem: (key: string): string | null => {
      if (!hasLocalStorage) {
        return fallbackStorage.get(key) ?? null;
      }

      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
        return fallbackStorage.get(key) ?? null;
      }
    },

    setItem: (key: string, value: string): void => {
      if (!hasLocalStorage) {
        fallbackStorage.set(key, value);
        return;
      }

      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Failed to write to localStorage:', error);
        fallbackStorage.set(key, value);

        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          console.warn('localStorage quota exceeded');
        }
      }
    },

    removeItem: (key: string): void => {
      if (!hasLocalStorage) {
        fallbackStorage.delete(key);
        return;
      }

      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
        fallbackStorage.delete(key);
      }
    },
  };
};

export const isValidStorageValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'object') {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  return true;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
};
