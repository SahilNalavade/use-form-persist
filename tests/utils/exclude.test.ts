import {
  shouldExcludeField,
  filterExcludedFields,
} from '../../src/utils/exclude';

describe('Exclude utilities', () => {
  describe('shouldExcludeField', () => {
    it('should exclude exact matches', () => {
      expect(shouldExcludeField('password', ['password'])).toBe(true);
      expect(shouldExcludeField('email', ['password'])).toBe(false);
    });

    it('should exclude nested fields', () => {
      expect(shouldExcludeField('user.password', ['user.password'])).toBe(true);
      expect(shouldExcludeField('user.email', ['user.password'])).toBe(false);
    });

    it('should exclude by prefix', () => {
      expect(shouldExcludeField('user.password', ['user'])).toBe(true);
      expect(shouldExcludeField('user.profile.secret', ['user'])).toBe(true);
      expect(shouldExcludeField('settings.theme', ['user'])).toBe(false);
    });
  });

  describe('filterExcludedFields', () => {
    const testData = {
      name: 'John',
      email: 'john@example.com',
      password: 'secret',
      user: {
        id: 1,
        profile: {
          avatar: 'avatar.jpg',
          secret: 'hidden',
        },
      },
      settings: {
        theme: 'dark',
        notifications: true,
      },
    };

    it('should filter top-level fields', () => {
      const filtered = filterExcludedFields(testData, ['password']);

      expect(filtered.name).toBe('John');
      expect(filtered.email).toBe('john@example.com');
      expect(filtered.password).toBeUndefined();
      expect(filtered.user).toBeDefined();
    });

    it('should filter nested fields', () => {
      const filtered = filterExcludedFields(testData, ['user.profile.secret']);

      expect(filtered.user?.profile?.secret).toBeUndefined();
      expect(filtered.user?.profile?.avatar).toBe('avatar.jpg');
      expect(filtered.user?.id).toBe(1);
    });

    it('should filter by prefix', () => {
      const filtered = filterExcludedFields(testData, ['user']);

      expect(filtered.user).toBeUndefined();
      expect(filtered.name).toBe('John');
      expect(filtered.settings).toBeDefined();
    });

    it('should handle empty exclude list', () => {
      const filtered = filterExcludedFields(testData, []);

      expect(filtered).toEqual(testData);
    });

    it('should handle multiple exclusions', () => {
      const filtered = filterExcludedFields(testData, [
        'password',
        'user.profile.secret',
      ]);

      expect(filtered.password).toBeUndefined();
      expect(filtered.user?.profile?.secret).toBeUndefined();
      expect(filtered.user?.profile?.avatar).toBe('avatar.jpg');
      expect(filtered.name).toBe('John');
    });

    it('should preserve empty objects when all nested fields are excluded', () => {
      const data = {
        user: {
          secret: 'hidden',
        },
        other: 'value',
      };

      const filtered = filterExcludedFields(data, ['user.secret']);

      expect(filtered.user).toBeUndefined();
      expect(filtered.other).toBe('value');
    });
  });
});
