import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useFormPersist } from '../src/useFormPersist';

interface TestFormData {
  name: string;
  email: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const defaultValues: TestFormData = {
  name: '',
  email: '',
  age: 0,
  preferences: {
    theme: 'light',
    notifications: true,
  },
};

describe('useFormPersist', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      expect(result.current.values).toEqual(defaultValues);
      expect(result.current.isHydrated).toBe(true);
    });

    it('should update values with setValue', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      expect(result.current.values.name).toBe('John Doe');
    });

    it('should update multiple values with setValues', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      act(() => {
        result.current.setValues({
          name: 'Jane Doe',
          email: 'jane@example.com',
        });
      });

      expect(result.current.values.name).toBe('Jane Doe');
      expect(result.current.values.email).toBe('jane@example.com');
    });

    it('should clear persisted data', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      act(() => {
        result.current.clearPersistedData();
      });

      expect(result.current.values).toEqual(defaultValues);
    });
  });

  describe('localStorage persistence', () => {
    it('should save data to localStorage', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, { debounceMs: 0 })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      setTimeout(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'test-form',
          expect.stringContaining('"name":"John Doe"')
        );
      }, 50);
    });

    it('should restore data from localStorage', () => {
      const savedData = {
        ...defaultValues,
        name: 'Saved User',
        email: 'saved@example.com',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(savedData)
      );

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      expect(result.current.values.name).toBe('Saved User');
      expect(result.current.values.email).toBe('saved@example.com');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, { debounceMs: 0 })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('useFormPersist save error'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Options', () => {
    it('should exclude specified fields from persistence', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, {
          exclude: ['email'],
          debounceMs: 0,
        })
      );

      act(() => {
        result.current.setValues({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      setTimeout(() => {
        const savedData = JSON.parse(
          (localStorage.setItem as jest.Mock).mock.calls[0][1]
        );
        expect(savedData.name).toBe('John Doe');
        expect(savedData.email).toBeUndefined();
      }, 50);
    });

    it('should use custom serialize/deserialize functions', () => {
      const serialize = jest.fn(data => JSON.stringify(data));
      const deserialize = jest.fn(data => JSON.parse(data));

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, {
          serialize,
          deserialize,
          debounceMs: 0,
        })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      setTimeout(() => {
        expect(serialize).toHaveBeenCalled();
      }, 50);
    });

    it('should call onError when errors occur', () => {
      const onError = jest.fn();
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, {
          onError,
          debounceMs: 0,
        })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      setTimeout(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      }, 50);
    });

    it('should not persist when enabled is false', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, {
          enabled: false,
          debounceMs: 0,
        })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      setTimeout(() => {
        expect(localStorage.setItem).not.toHaveBeenCalled();
      }, 50);
    });
  });

  describe('SSR compatibility', () => {
    it('should handle server environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      expect(result.current.values).toEqual(defaultValues);
      expect(result.current.isHydrated).toBe(true);

      global.window = originalWindow;
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid JSON in localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid json');

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      expect(result.current.values).toEqual(defaultValues);
    });

    it('should handle nested object updates', () => {
      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues)
      );

      act(() => {
        result.current.setValue('preferences', {
          theme: 'dark',
          notifications: false,
        });
      });

      expect(result.current.values.preferences.theme).toBe('dark');
      expect(result.current.values.preferences.notifications).toBe(false);
    });

    it('should handle quota exceeded error', () => {
      const quotaError = new DOMException(
        'Quota exceeded',
        'QuotaExceededError'
      );
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw quotaError;
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() =>
        useFormPersist('test-form', defaultValues, { debounceMs: 0 })
      );

      act(() => {
        result.current.setValue('name', 'John Doe');
      });

      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('localStorage quota exceeded')
        );
      }, 50);

      consoleSpy.mockRestore();
    });
  });
});
