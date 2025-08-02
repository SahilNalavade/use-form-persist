import {
  createStorageAdapter,
  isValidStorageValue,
  deepClone,
} from '../../src/utils/storage';

describe('Storage utilities', () => {
  describe('createStorageAdapter', () => {
    it('should use localStorage when available', () => {
      const adapter = createStorageAdapter();

      adapter.setItem('test', 'value');
      expect(adapter.getItem('test')).toBe('value');

      adapter.removeItem('test');
      expect(adapter.getItem('test')).toBeNull();
    });

    it('should fallback to Map when localStorage is not available', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const adapter = createStorageAdapter();

      adapter.setItem('test', 'value');
      expect(adapter.getItem('test')).toBe('value');

      adapter.removeItem('test');
      expect(adapter.getItem('test')).toBeNull();

      global.window = originalWindow;
    });

    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const adapter = createStorageAdapter();

      adapter.setItem('test', 'value');
      expect(consoleSpy).toHaveBeenCalled();
      expect(adapter.getItem('test')).toBe('value');

      Storage.prototype.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('isValidStorageValue', () => {
    it('should return false for null and undefined', () => {
      expect(isValidStorageValue(null)).toBe(false);
      expect(isValidStorageValue(undefined)).toBe(false);
    });

    it('should return true for valid values', () => {
      expect(isValidStorageValue('string')).toBe(true);
      expect(isValidStorageValue(123)).toBe(true);
      expect(isValidStorageValue(true)).toBe(true);
      expect(isValidStorageValue({ key: 'value' })).toBe(true);
      expect(isValidStorageValue([1, 2, 3])).toBe(true);
    });

    it('should handle circular references', () => {
      const circular: any = { prop: null };
      circular.prop = circular;

      expect(isValidStorageValue(circular)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone('string')).toBe('string');
      expect(deepClone(123)).toBe(123);
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone dates', () => {
      const date = new Date();
      const cloned = deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it('should clone arrays', () => {
      const array = [1, 2, { nested: 'value' }];
      const cloned = deepClone(array);

      expect(cloned).toEqual(array);
      expect(cloned).not.toBe(array);
      expect(cloned[2]).not.toBe(array[2]);
    });

    it('should clone objects', () => {
      const obj = {
        prop1: 'value1',
        prop2: {
          nested: 'nested value',
          array: [1, 2, 3],
        },
      };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.prop2).not.toBe(obj.prop2);
      expect(cloned.prop2.array).not.toBe(obj.prop2.array);
    });
  });
});
