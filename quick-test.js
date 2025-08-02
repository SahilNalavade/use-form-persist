#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up quick test for use-form-persist...\n');

// Get the target directory from command line or use default
const targetDir = process.argv[2] || '../test-form-persist';
const fullTargetPath = path.resolve(targetDir);

console.log(`Target directory: ${fullTargetPath}`);

// Check if target directory exists
if (!fs.existsSync(fullTargetPath)) {
    console.log('❌ Target directory does not exist.');
    console.log('Please run this from inside your React app directory, or:');
    console.log('node quick-test.js /path/to/your/react/app');
    process.exit(1);
}

// Check if it's a React app
const packageJsonPath = path.join(fullTargetPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ No package.json found. Is this a React app?');
    process.exit(1);
}

try {
    // Create node_modules/use-form-persist directory
    const nodeModulesPath = path.join(fullTargetPath, 'node_modules', 'use-form-persist');
    
    console.log('📁 Creating directory structure...');
    fs.mkdirSync(nodeModulesPath, { recursive: true });
    
    // Copy dist folder
    console.log('📦 Copying built package...');
    const distSource = path.join(__dirname, 'dist');
    const distTarget = path.join(nodeModulesPath, 'dist');
    
    // Copy dist folder recursively
    execSync(`cp -r "${distSource}" "${nodeModulesPath}/"`);
    
    // Copy package.json
    const pkgSource = path.join(__dirname, 'package.json');
    const pkgTarget = path.join(nodeModulesPath, 'package.json');
    fs.copyFileSync(pkgSource, pkgTarget);
    
    // Create a simple index.js that exports from dist
    const indexContent = `module.exports = require('./dist/index.js');`;
    fs.writeFileSync(path.join(nodeModulesPath, 'index.js'), indexContent);
    
    // Create App.js with test code
    console.log('📝 Creating test App.js...');
    const appJsContent = `import { useFormPersist } from 'use-form-persist';

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

export default App;`;

    const appJsPath = path.join(fullTargetPath, 'src', 'App.js');
    fs.writeFileSync(appJsPath, appJsContent);
    
    console.log('✅ Setup complete!\n');
    console.log('🎯 Next steps:');
    console.log(`   1. cd ${targetDir}`);
    console.log('   2. npm start');
    console.log('   3. Fill out the form');
    console.log('   4. Refresh the page to see persistence in action!\n');
    console.log('🔍 What to look for:');
    console.log('   - Form data saves as you type');
    console.log('   - Data persists after page refresh');
    console.log('   - Clear button resets everything');
    console.log('   - Check DevTools → Application → Local Storage');

} catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Manual steps:');
    console.log('   1. mkdir -p node_modules/use-form-persist');
    console.log(`   2. cp -r "${path.join(__dirname, 'dist')}" node_modules/use-form-persist/`);
    console.log(`   3. cp "${path.join(__dirname, 'package.json')}" node_modules/use-form-persist/`);
    process.exit(1);
}