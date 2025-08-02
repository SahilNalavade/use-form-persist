# use-form-persist

A lightweight, type-safe React hook for automatically persisting and restoring form state to/from localStorage with zero dependencies.

[![npm version](https://badge.fury.io/js/use-form-persist.svg)](https://badge.fury.io/js/use-form-persist)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/use-form-persist)](https://bundlephobia.com/package/use-form-persist)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 **Automatic persistence** - Form state is automatically saved to localStorage on every change
- 🚀 **SSR compatible** - Works with Next.js, Gatsby, and other server-side rendering frameworks
- 📝 **TypeScript support** - Full type safety with generics
- 🎯 **Zero dependencies** - No external libraries required
- 🔧 **Highly configurable** - Customizable debouncing, field exclusion, and serialization
- 🛡️ **Error handling** - Graceful fallbacks when localStorage is unavailable
- 📦 **Tiny bundle size** - Less than 5kb minified
- ⚡ **Performance optimized** - Debounced updates and efficient change detection

## Installation

```bash
npm install use-form-persist
```

```bash
yarn add use-form-persist
```

```bash
pnpm add use-form-persist
```

## Quick Start

```tsx
import { useFormPersist } from 'use-form-persist';

function ContactForm() {
  const { values, setValue, clearPersistedData } = useFormPersist('contact-form', {
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', values);
    clearPersistedData(); // Clear after successful submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        placeholder=\"Name\"
      />
      <input
        value={values.email}
        onChange={(e) => setValue('email', e.target.value)}
        placeholder=\"Email\"
      />
      <textarea
        value={values.message}
        onChange={(e) => setValue('message', e.target.value)}
        placeholder=\"Message\"
      />
      <button type=\"submit\">Send</button>
      <button type=\"button\" onClick={clearPersistedData}>
        Clear Form
      </button>
    </form>
  );
}
```

## API Reference

### useFormPersist

```tsx
const {
  values,
  setValue,
  setValues,
  clearPersistedData,
  isHydrated
} = useFormPersist(storageKey, defaultValues, options);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `storageKey` | `string` | Unique key for localStorage storage |
| `defaultValues` | `T` | Initial form values object |
| `options` | `UseFormPersistOptions<T>` | Configuration options (optional) |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `values` | `T` | Current form values |
| `setValue` | `<K extends keyof T>(key: K, value: T[K]) => void` | Update a single field |
| `setValues` | `(values: Partial<T>) => void` | Update multiple fields at once |
| `clearPersistedData` | `() => void` | Clear persisted data and reset to defaults |
| `isHydrated` | `boolean` | Whether the initial data has been loaded from storage |

#### Options

```tsx
interface UseFormPersistOptions<T> {
  debounceMs?: number;                    // Debounce delay for saves (default: 300)
  exclude?: Array<keyof T | string>;      // Fields to exclude from persistence
  serialize?: (value: T) => string;       // Custom serialization function
  deserialize?: (value: string) => T;     // Custom deserialization function
  onError?: (error: Error) => void;       // Error handler
  enabled?: boolean;                      // Enable/disable persistence (default: true)
}
```

## Advanced Usage

### Excluding Sensitive Fields

```tsx
const { values, setValue } = useFormPersist('user-form', {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
}, {
  exclude: ['password', 'confirmPassword'], // Don't persist passwords
});
```

### Complex Form with Nested Objects

```tsx
interface UserProfile {
  personal: {
    firstName: string;
    lastName: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const { values, setValue } = useFormPersist<UserProfile>('profile', {
  personal: {
    firstName: '',
    lastName: '',
  },
  preferences: {
    theme: 'light',
    notifications: true,
  },
});

// Update nested values
setValue('personal', { ...values.personal, firstName: 'John' });
setValue('preferences', { ...values.preferences, theme: 'dark' });
```

### Custom Serialization

```tsx
const { values, setValue } = useFormPersist('form', defaultValues, {
  serialize: (data) => btoa(JSON.stringify(data)), // Base64 encoding
  deserialize: (data) => JSON.parse(atob(data)),   // Base64 decoding
});
```

### Error Handling

```tsx
const { values, setValue } = useFormPersist('form', defaultValues, {
  onError: (error) => {
    console.error('Form persistence error:', error);
    // Send to error tracking service
    analytics.track('form_persistence_error', { error: error.message });
  },
});
```

### Conditional Persistence

```tsx
const [saveEnabled, setSaveEnabled] = useState(true);

const { values, setValue } = useFormPersist('form', defaultValues, {
  enabled: saveEnabled, // Dynamically enable/disable
});
```

## Framework Integration

### Next.js

```tsx
import { useFormPersist } from 'use-form-persist';

function MyForm() {
  const { values, setValue, isHydrated } = useFormPersist('my-form', {
    field1: '',
    field2: '',
  });

  // Prevent hydration mismatch
  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <input
        value={values.field1}
        onChange={(e) => setValue('field1', e.target.value)}
      />
      {/* ... */}
    </form>
  );
}
```

### React Hook Form Integration

```tsx
import { useForm, Controller } from 'react-hook-form';
import { useFormPersist } from 'use-form-persist';
import { useEffect } from 'react';

function MyForm() {
  const { control, handleSubmit, reset } = useForm();
  const { values, setValues, clearPersistedData } = useFormPersist('rhf-form', {
    name: '',
    email: '',
  });

  // Sync with react-hook-form
  useEffect(() => {
    reset(values);
  }, [values, reset]);

  const onSubmit = (data) => {
    console.log(data);
    clearPersistedData();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name=\"name\"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => {
              field.onChange(e);
              setValues({ ...values, name: e.target.value });
            }}
          />
        )}
      />
      {/* ... */}
    </form>
  );
}
```

## Performance Considerations

- **Debouncing**: By default, saves are debounced by 300ms to prevent excessive localStorage writes
- **Selective updates**: Only changed fields trigger persistence
- **Memory efficient**: Uses efficient change detection to minimize re-renders
- **Bundle size**: Tree-shakeable and optimized for minimal bundle impact

## Browser Support

- All modern browsers with localStorage support
- Graceful degradation when localStorage is unavailable
- SSR/Node.js environments (uses in-memory fallback)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Sahil Nalavade](https://github.com/sahilnalavade)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.