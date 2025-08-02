# How to Use use-form-persist

## 🚀 Quick Start

### 1. Install the package
```bash
# From your local build (for testing)
npm link use-form-persist

# Or when published to npm
npm install use-form-persist
```

### 2. Basic Usage

```tsx
import React from 'react';
import { useFormPersist } from 'use-form-persist';

function ContactForm() {
  const { values, setValue, clearPersistedData, isHydrated } = useFormPersist(
    'contact-form', // unique storage key
    {
      name: '',
      email: '',
      message: ''
    }
  );

  // Wait for hydration in SSR environments
  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <input
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={values.email}
        onChange={(e) => setValue('email', e.target.value)}
        placeholder="Email"
      />
      <textarea
        value={values.message}
        onChange={(e) => setValue('message', e.target.value)}
        placeholder="Message"
      />
      
      <button type="button" onClick={clearPersistedData}>
        Clear Form
      </button>
    </form>
  );
}
```

### 3. Advanced Usage with Options

```tsx
import { useFormPersist } from 'use-form-persist';

function AdvancedForm() {
  const { values, setValue, setValues } = useFormPersist(
    'advanced-form',
    {
      user: {
        name: '',
        email: '',
        password: ''
      },
      preferences: {
        theme: 'light',
        notifications: true
      }
    },
    {
      debounceMs: 500,                    // Slower debounce
      exclude: ['user.password'],         // Don't persist password
      onError: (error) => {
        console.error('Persistence failed:', error);
      },
      serialize: (data) => JSON.stringify(data),
      deserialize: (data) => JSON.parse(data)
    }
  );

  return (
    <form>
      {/* Nested object updates */}
      <input
        value={values.user.name}
        onChange={(e) => setValue('user', {
          ...values.user,
          name: e.target.value
        })}
      />
      
      {/* Bulk updates */}
      <button onClick={() => setValues({
        user: { ...values.user, name: 'John' },
        preferences: { ...values.preferences, theme: 'dark' }
      })}>
        Fill Sample Data
      </button>
    </form>
  );
}
```

## 🧪 Testing Instructions

### Test in Browser (Easy)
1. Open the `test-app.html` file that was created
2. Fill out the form
3. Refresh the page - data should be restored!
4. Check DevTools → Application → Local Storage

### Test in React App
1. Create a new React app: `npx create-react-app test-form-persist`
2. Link the package: `npm link use-form-persist`
3. Replace App.js with the examples above
4. Run: `npm start`

### Test with Next.js (SSR)
```tsx
import { useFormPersist } from 'use-form-persist';

export default function MyForm() {
  const { values, setValue, isHydrated } = useFormPersist('nextjs-form', {
    name: '',
    email: ''
  });

  // Important: Handle SSR hydration
  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <input 
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
      />
    </form>
  );
}
```

## 🔧 API Reference

### `useFormPersist(storageKey, defaultValues, options?)`

#### Parameters
- **storageKey**: `string` - Unique key for localStorage
- **defaultValues**: `T` - Initial form values
- **options**: `UseFormPersistOptions<T>` (optional)

#### Options
```tsx
interface UseFormPersistOptions<T> {
  debounceMs?: number;                    // Default: 300
  exclude?: Array<keyof T | string>;      // Fields to exclude
  serialize?: (value: T) => string;       // Custom serialization
  deserialize?: (value: string) => T;     // Custom deserialization  
  onError?: (error: Error) => void;       // Error handler
  enabled?: boolean;                      // Enable/disable persistence
}
```

#### Returns
```tsx
interface UseFormPersistReturn<T> {
  values: T;                             // Current form values
  setValue: (key, value) => void;        // Update single field
  setValues: (values: Partial<T>) => void; // Update multiple fields
  clearPersistedData: () => void;        // Clear persisted data
  isHydrated: boolean;                   // SSR hydration status
}
```

## 🎯 Key Features Demonstrated

✅ **Automatic persistence** - Type and see it save
✅ **Page refresh** - Data survives refreshes  
✅ **Nested objects** - Complex form structures
✅ **Field exclusion** - Sensitive data protection
✅ **Error handling** - Graceful failures
✅ **SSR compatibility** - Works with Next.js
✅ **Bundle size** - Only 2.6KB gzipped
✅ **Zero dependencies** - No external libs