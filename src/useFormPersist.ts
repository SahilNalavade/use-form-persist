import { useState, useEffect, useCallback, useRef } from 'react';
import { UseFormPersistOptions, UseFormPersistReturn } from './types';
import {
  createStorageAdapter,
  deepClone,
  isValidStorageValue,
} from './utils/storage';
import { debounce } from './utils/debounce';
import { filterExcludedFields } from './utils/exclude';

export function useFormPersist<T extends Record<string, any>>(
  storageKey: string,
  defaultValues: T,
  options: UseFormPersistOptions<T> = {}
): UseFormPersistReturn<T> {
  const {
    debounceMs = 300,
    exclude = [],
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError,
    enabled = true,
  } = options;

  const [values, setValuesState] = useState<T>(defaultValues);
  const [isHydrated, setIsHydrated] = useState(false);
  const storageAdapter = useRef(createStorageAdapter());
  const hasInitialized = useRef(false);

  const handleError = useCallback(
    (error: Error, operation: string) => {
      console.warn(`useFormPersist ${operation} error:`, error);
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  const saveToStorage = useCallback(
    debounce((dataToSave: T) => {
      if (!enabled) return;

      try {
        const filteredData =
          exclude.length > 0
            ? filterExcludedFields(dataToSave, exclude)
            : dataToSave;

        if (isValidStorageValue(filteredData)) {
          const serialized = serialize(filteredData as T);
          storageAdapter.current.setItem(storageKey, serialized);
        }
      } catch (error) {
        handleError(error as Error, 'save');
      }
    }, debounceMs),
    [storageKey, serialize, exclude, enabled, debounceMs, handleError]
  );

  const loadFromStorage = useCallback((): T => {
    if (!enabled) return defaultValues;

    try {
      const stored = storageAdapter.current.getItem(storageKey);
      if (stored) {
        const parsed = deserialize(stored);
        return { ...defaultValues, ...parsed };
      }
    } catch (error) {
      handleError(error as Error, 'load');
    }

    return defaultValues;
  }, [storageKey, defaultValues, deserialize, enabled, handleError]);

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValuesState(prev => {
        const newValues = { ...prev, [key]: value };
        saveToStorage(newValues);
        return newValues;
      });
    },
    [saveToStorage]
  );

  const setValues = useCallback(
    (newValues: Partial<T>) => {
      setValuesState(prev => {
        const updated = { ...prev, ...newValues };
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const clearPersistedData = useCallback(() => {
    try {
      storageAdapter.current.removeItem(storageKey);
      setValuesState(deepClone(defaultValues));
    } catch (error) {
      handleError(error as Error, 'clear');
    }
  }, [storageKey, defaultValues, handleError]);

  useEffect(() => {
    if (!hasInitialized.current) {
      const savedValues = loadFromStorage();
      setValuesState(savedValues);
      setIsHydrated(true);
      hasInitialized.current = true;
    }
  }, [loadFromStorage]);

  useEffect(() => {
    if (isHydrated && enabled) {
      saveToStorage(values);
    }
  }, [values, saveToStorage, isHydrated, enabled]);

  return {
    values,
    setValue,
    setValues,
    clearPersistedData,
    isHydrated,
  };
}
