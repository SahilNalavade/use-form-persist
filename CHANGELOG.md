# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-08

### Added
- Initial release of use-form-persist
- Core `useFormPersist` hook with automatic localStorage persistence
- TypeScript support with full type safety
- SSR compatibility with fallback storage
- Configurable debouncing for performance optimization
- Field exclusion functionality for sensitive data
- Custom serialization/deserialization support
- Comprehensive error handling with graceful fallbacks
- Zero dependencies implementation
- Support for nested objects and complex form structures
- Bundle size optimization (< 5kb minified)
- Comprehensive test suite with 100% coverage
- Complete documentation with examples

### Features
- Automatic form state persistence to localStorage
- Configurable debounce timing (default: 300ms)
- Exclude sensitive fields from persistence
- Custom serialize/deserialize functions
- Error handling with optional callbacks
- Enable/disable persistence dynamically
- Deep cloning for immutable updates
- SSR-safe with hydration state tracking
- Storage quota exceeded error handling
- Fallback to in-memory storage when localStorage unavailable

### Browser Support
- All modern browsers with localStorage support
- Node.js/SSR environments with fallback storage
- Graceful degradation when storage is unavailable