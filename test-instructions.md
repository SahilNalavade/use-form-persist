# 🧪 How to Test use-form-persist

## ✅ Method 1: Clean React App (Recommended)

```bash
# 1. Create a fresh React app in a different location
cd ~/Desktop  # Or any other location
npx create-react-app test-form-persist
cd test-form-persist

# 2. Copy the built package directly
cp -r "/Users/sahilnalavade/Documents/Inspire 3/use-form-persist/use-form-persist/dist" ./node_modules/use-form-persist/
cp "/Users/sahilnalavade/Documents/Inspire 3/use-form-persist/use-form-persist/package.json" ./node_modules/use-form-persist/

# 3. Replace src/App.js with:
```

```jsx
import { useFormPersist } from 'use-form-persist';

function App() {
  const { values, setValue, clearPersistedData, isHydrated } = useFormPersist(
    'test-form',
    {
      name: '',
      email: '',
      message: '',
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  );

  if (!isHydrated) {
    return <div>Loading form...</div>;
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20 }}>
      <h1>🚀 Form Persistence Test</h1>
      
      <div style={{ marginBottom: 20, padding: 15, background: '#e8f5e8', borderRadius: 5 }}>
        ✅ Hook loaded! Form data auto-saves as you type.
        <br />
        <strong>Try:</strong> Fill the form → refresh page → see data restored!
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Name:</label>
        <input
          value={values.name}
          onChange={(e) => setValue('name', e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 5 }}
          placeholder="Enter your name"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Email:</label>
        <input
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 5 }}
          placeholder="Enter your email"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Message:</label>
        <textarea
          value={values.message}
          onChange={(e) => setValue('message', e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 5, height: 80 }}
          placeholder="Enter your message"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Theme:</label>
        <select
          value={values.preferences.theme}
          onChange={(e) => setValue('preferences', {
            ...values.preferences,
            theme: e.target.value
          })}
          style={{ width: '100%', padding: 8, marginTop: 5 }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={values.preferences.notifications}
            onChange={(e) => setValue('preferences', {
              ...values.preferences,
              notifications: e.target.checked
            })}
          />
          {' '}Enable notifications
        </label>
      </div>

      <button 
        onClick={clearPersistedData}
        style={{ padding: '10px 20px', marginRight: 10, background: '#dc3545', color: 'white', border: 'none', borderRadius: 4 }}
      >
        Clear Form
      </button>

      <button
        onClick={() => console.log('Current values:', values)}
        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
      >
        Log Values
      </button>

      <div style={{ marginTop: 30, padding: 15, background: '#f8f9fa', borderRadius: 5 }}>
        <h3>Debug Info:</h3>
        <p><strong>Hydrated:</strong> {isHydrated ? 'Yes' : 'No'}</p>
        <p><strong>Storage Key:</strong> test-form</p>
        <pre style={{ background: 'white', padding: 10, borderRadius: 4, fontSize: 12 }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
```

```bash
# 4. Start the app
npm start
```

## ✅ Method 2: Direct npm Package Test

```bash
# 1. Publish to npm (or use local registry)
cd "/Users/sahilnalavade/Documents/Inspire 3/use-form-persist/use-form-persist"
npm publish  # When ready

# 2. Install in any React project
npm install use-form-persist
```

## ✅ Method 3: Webpack Resolution Fix

If you want to use `npm link`, add this to your test app's `package.json`:

```json
{
  "resolutions": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

Then run:
```bash
npm install
npm link use-form-persist
```

## 🎯 What to Test

1. **Basic persistence**: Type → refresh → data restored
2. **Nested objects**: Theme/notification changes persist
3. **Clear function**: Clear button resets form
4. **localStorage**: Check DevTools → Application → Local Storage
5. **SSR compatibility**: Works in Next.js (if testing)

## 🐛 Common Issues

- **"Invalid hook call"**: Multiple React copies (use Method 1)
- **"useFormPersist is not a function"**: Import issue (check import path)
- **Data not persisting**: Check browser localStorage permissions
- **TypeScript errors**: Ensure types are exported correctly

## ✅ Success Indicators

- ✅ Form data auto-saves as you type
- ✅ Page refresh restores all data
- ✅ Clear button resets everything
- ✅ No console errors
- ✅ localStorage shows saved data
- ✅ TypeScript intellisense works