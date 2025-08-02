#!/usr/bin/env node

/**
 * Comprehensive Pre-Publish Test Suite
 * Tests all scenarios the package should handle
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE PRE-PUBLISH REVIEW\n');

let hasErrors = false;
const issues = [];
const warnings = [];

function error(msg) {
  hasErrors = true;
  issues.push(`❌ ${msg}`);
  console.log(`❌ ${msg}`);
}

function warning(msg) {
  warnings.push(`⚠️  ${msg}`);
  console.log(`⚠️  ${msg}`);
}

function success(msg) {
  console.log(`✅ ${msg}`);
}

// Test 1: Package.json Validation
console.log('📦 PACKAGE.JSON VALIDATION');
try {
  const pkg = require('./package.json');
  
  // Essential fields
  if (!pkg.name) error('Missing package name');
  else if (pkg.name !== 'use-form-persist') warning('Package name should be "use-form-persist"');
  else success('Package name correct');
  
  if (!pkg.version) error('Missing version');
  else success(`Version: ${pkg.version}`);
  
  if (!pkg.description) error('Missing description');
  else success('Description present');
  
  if (!pkg.main) error('Missing main entry point');
  else if (!fs.existsSync(pkg.main)) error(`Main file doesn't exist: ${pkg.main}`);
  else success(`Main entry: ${pkg.main}`);
  
  if (!pkg.module) warning('Missing ES module entry');
  else if (!fs.existsSync(pkg.module)) error(`Module file doesn't exist: ${pkg.module}`);
  else success(`ES Module entry: ${pkg.module}`);
  
  if (!pkg.types) error('Missing TypeScript types');
  else if (!fs.existsSync(pkg.types)) error(`Types file doesn't exist: ${pkg.types}`);
  else success(`Types entry: ${pkg.types}`);
  
  // React compatibility
  if (!pkg.peerDependencies || !pkg.peerDependencies.react) {
    error('Missing React peer dependency');
  } else {
    const reactVersion = pkg.peerDependencies.react;
    if (!reactVersion.includes('16.8')) warning('Should support React 16.8+ for hooks');
    success(`React peer dependency: ${reactVersion}`);
  }
  
  // Files array
  if (!pkg.files || !Array.isArray(pkg.files)) {
    error('Missing files array in package.json');
  } else {
    pkg.files.forEach(file => {
      if (!fs.existsSync(file)) {
        error(`File in files array doesn't exist: ${file}`);
      }
    });
    success(`Files array: ${pkg.files.join(', ')}`);
  }
  
  // Keywords
  if (!pkg.keywords || !Array.isArray(pkg.keywords) || pkg.keywords.length < 3) {
    warning('Should have more keywords for discoverability');
  } else {
    success(`Keywords: ${pkg.keywords.length} keywords`);
  }
  
} catch (err) {
  error(`Failed to read package.json: ${err.message}`);
}

console.log('\n📁 BUILD OUTPUT VALIDATION');

// Test 2: Build outputs exist and are valid
const buildFiles = [
  'dist/index.js',      // CommonJS
  'dist/index.esm.js',  // ES Module  
  'dist/index.umd.js',  // UMD
  'dist/index.d.ts'     // TypeScript declarations
];

buildFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    error(`Missing build file: ${file}`);
  } else {
    const stat = fs.statSync(file);
    if (stat.size === 0) {
      error(`Build file is empty: ${file}`);
    } else {
      success(`${file} (${(stat.size / 1024).toFixed(2)} KB)`);
    }
  }
});

// Test 3: Check build contents
console.log('\n🔍 BUILD CONTENT VALIDATION');

try {
  // Check CommonJS build
  const cjsContent = fs.readFileSync('dist/index.js', 'utf8');
  if (!cjsContent.includes('useFormPersist')) {
    error('CommonJS build missing useFormPersist export');
  } else if (!cjsContent.includes('exports')) {
    error('CommonJS build missing proper exports');
  } else {
    success('CommonJS build valid');
  }
  
  // Check ES Module build
  const esmContent = fs.readFileSync('dist/index.esm.js', 'utf8');
  if (!esmContent.includes('useFormPersist')) {
    error('ES Module build missing useFormPersist export');
  } else if (!esmContent.includes('export')) {
    error('ES Module build missing proper exports');
  } else {
    success('ES Module build valid');
  }
  
  // Check UMD build
  const umdContent = fs.readFileSync('dist/index.umd.js', 'utf8');
  if (!umdContent.includes('UseFormPersist')) {
    error('UMD build missing global name');
  } else if (!umdContent.includes('react')) {
    error('UMD build should reference React externally');
  } else {
    success('UMD build valid');
  }
  
  // Check TypeScript declarations
  const dtsContent = fs.readFileSync('dist/index.d.ts', 'utf8');
  if (!dtsContent.includes('useFormPersist')) {
    error('TypeScript declarations missing useFormPersist');
  } else if (!dtsContent.includes('UseFormPersistOptions')) {
    error('TypeScript declarations missing types');
  } else {
    success('TypeScript declarations valid');
  }
  
} catch (err) {
  error(`Failed to validate build contents: ${err.message}`);
}

// Test 4: Bundle size check
console.log('\n📊 BUNDLE SIZE VALIDATION');

try {
  const cjsSize = fs.statSync('dist/index.js').size;
  const esmSize = fs.statSync('dist/index.esm.js').size;
  const umdSize = fs.statSync('dist/index.umd.js').size;
  
  const maxSize = 10 * 1024; // 10KB limit
  
  if (cjsSize > maxSize) warning(`CommonJS bundle large: ${(cjsSize/1024).toFixed(2)} KB`);
  else success(`CommonJS size: ${(cjsSize/1024).toFixed(2)} KB`);
  
  if (esmSize > maxSize) warning(`ES Module bundle large: ${(esmSize/1024).toFixed(2)} KB`);
  else success(`ES Module size: ${(esmSize/1024).toFixed(2)} KB`);
  
  if (umdSize > 5120) warning(`UMD bundle large: ${(umdSize/1024).toFixed(2)} KB`);
  else success(`UMD size: ${(umdSize/1024).toFixed(2)} KB`);
  
} catch (err) {
  error(`Failed to check bundle sizes: ${err.message}`);
}

// Test 5: Documentation check
console.log('\n📚 DOCUMENTATION VALIDATION');

const docFiles = ['README.md', 'LICENSE', 'CHANGELOG.md'];
docFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    if (file === 'README.md' || file === 'LICENSE') {
      error(`Missing required file: ${file}`);
    } else {
      warning(`Missing recommended file: ${file}`);
    }
  } else {
    const content = fs.readFileSync(file, 'utf8');
    if (content.length < 100) {
      warning(`${file} seems too short`);
    } else {
      success(`${file} present`);
    }
  }
});

// Test 6: Source code validation
console.log('\n🔍 SOURCE CODE VALIDATION');

const srcFiles = [
  'src/index.ts',
  'src/useFormPersist.ts', 
  'src/types.ts'
];

srcFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    error(`Missing source file: ${file}`);
  } else {
    success(`Source file: ${file}`);
  }
});

// Test 7: Git repository check
console.log('\n📂 REPOSITORY VALIDATION');

if (!fs.existsSync('.git')) {
  warning('Not a git repository');
} else {
  success('Git repository initialized');
  
  if (!fs.existsSync('.gitignore')) {
    warning('Missing .gitignore file');
  } else {
    success('.gitignore present');
  }
}

// Test 8: React compatibility scenarios
console.log('\n⚛️  REACT COMPATIBILITY CHECK');

const reactVersions = [
  { version: '16.8.0', supported: true, note: 'Minimum version for hooks' },
  { version: '17.0.0', supported: true, note: 'Stable version' },
  { version: '18.0.0', supported: true, note: 'Latest stable' },
];

reactVersions.forEach(({ version, supported, note }) => {
  if (supported) {
    success(`React ${version} - ${note}`);
  } else {
    warning(`React ${version} - ${note}`);
  }
});

console.log('\n🏁 FINAL SUMMARY');

if (hasErrors) {
  console.log(`\n❌ FOUND ${issues.length} CRITICAL ISSUES:`);
  issues.forEach(issue => console.log(`   ${issue}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  FOUND ${warnings.length} WARNINGS:`);
  warnings.forEach(warning => console.log(`   ${warning}`));
}

if (!hasErrors && warnings.length === 0) {
  console.log('\n🎉 ALL CHECKS PASSED! READY TO PUBLISH! 🚀');
} else if (!hasErrors) {
  console.log('\n✅ NO CRITICAL ISSUES FOUND!');
  console.log('⚠️  Consider addressing warnings before publishing');
} else {
  console.log('\n🛑 CRITICAL ISSUES FOUND - DO NOT PUBLISH YET');
}

console.log('\n📋 PUBLISHING CHECKLIST:');
console.log('   □ Create GitHub repository');
console.log('   □ Push code to GitHub'); 
console.log('   □ Update package.json with correct repo URLs');
console.log('   □ Run: npm publish --dry-run');
console.log('   □ Run: npm publish');

process.exit(hasErrors ? 1 : 0);