// Manual test for use-form-persist
// Run with: node manual-test.js

console.log('🧪 Testing use-form-persist package...\n');

try {
    // Test 1: Check if the built files exist
    const fs = require('fs');
    const path = require('path');
    
    const distPath = path.join(__dirname, 'dist');
    const files = fs.readdirSync(distPath);
    
    console.log('✅ Built files found:');
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');
    
    // Test 2: Check package.json configuration
    const pkg = require('./package.json');
    console.log('✅ Package configuration:');
    console.log(`   - Name: ${pkg.name}`);
    console.log(`   - Version: ${pkg.version}`);
    console.log(`   - Main: ${pkg.main}`);
    console.log(`   - Module: ${pkg.module}`);
    console.log(`   - Types: ${pkg.types}`);
    console.log('');
    
    // Test 3: Check TypeScript declarations
    const mainDts = path.join(__dirname, 'dist', 'index.d.ts');
    if (fs.existsSync(mainDts)) {
        console.log('✅ TypeScript declarations generated');
        const dtsContent = fs.readFileSync(mainDts, 'utf8');
        if (dtsContent.includes('useFormPersist')) {
            console.log('   - useFormPersist export found');
        }
        if (dtsContent.includes('UseFormPersistOptions')) {
            console.log('   - UseFormPersistOptions type found');
        }
        if (dtsContent.includes('UseFormPersistReturn')) {
            console.log('   - UseFormPersistReturn type found');
        }
    } else {
        console.log('❌ TypeScript declarations missing');
    }
    console.log('');
    
    // Test 4: Check bundle sizes
    const mainJsPath = path.join(__dirname, 'dist', 'index.js');
    const esmJsPath = path.join(__dirname, 'dist', 'index.esm.js');
    const umdJsPath = path.join(__dirname, 'dist', 'index.umd.js');
    
    console.log('📦 Bundle sizes:');
    if (fs.existsSync(mainJsPath)) {
        const size = (fs.statSync(mainJsPath).size / 1024).toFixed(2);
        console.log(`   - CommonJS: ${size} KB`);
    }
    if (fs.existsSync(esmJsPath)) {
        const size = (fs.statSync(esmJsPath).size / 1024).toFixed(2);
        console.log(`   - ES Module: ${size} KB`);
    }
    if (fs.existsSync(umdJsPath)) {
        const size = (fs.statSync(umdJsPath).size / 1024).toFixed(2);
        console.log(`   - UMD: ${size} KB`);
    }
    console.log('');
    
    // Test 5: Try to require the built module (without React)
    console.log('🔍 Testing module loading...');
    try {
        // This will fail because React isn't available in Node.js, but we can check the exports
        const mainBuild = fs.readFileSync(mainJsPath, 'utf8');
        if (mainBuild.includes('useFormPersist')) {
            console.log('✅ useFormPersist function found in CommonJS build');
        }
        if (mainBuild.includes('exports')) {
            console.log('✅ CommonJS exports detected');
        }
        
        const esmBuild = fs.readFileSync(esmJsPath, 'utf8');
        if (esmBuild.includes('export')) {
            console.log('✅ ES Module exports detected');
        }
    } catch (error) {
        console.log('❌ Error reading built files:', error.message);
    }
    console.log('');
    
    console.log('🎉 Package validation complete!');
    console.log('');
    console.log('📋 To test in a React app:');
    console.log('   1. Create a new React app: npx create-react-app test-app');
    console.log('   2. cd test-app');
    console.log('   3. npm link use-form-persist');
    console.log('   4. Import and use: import { useFormPersist } from "use-form-persist"');
    console.log('');
    console.log('🌐 To test in browser:');
    console.log('   1. Open test-app.html in your browser');
    console.log('   2. Fill out the form');
    console.log('   3. Refresh the page to see persistence');
    
} catch (error) {
    console.error('❌ Test failed:', error);
}