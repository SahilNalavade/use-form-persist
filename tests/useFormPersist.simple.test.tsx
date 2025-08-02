import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useFormPersist } from '../src/useFormPersist';

interface TestFormData {
  name: string;
  email: string;
  age: number;
}

const defaultValues: TestFormData = {
  name: '',
  email: '',
  age: 0,
};

describe('useFormPersist - Core Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

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

  it('should respect disabled state', () => {
    const { result } = renderHook(() =>
      useFormPersist('test-form', defaultValues, { enabled: false })
    );

    act(() => {
      result.current.setValue('name', 'John Doe');
    });

    expect(result.current.values.name).toBe('John Doe');
  });
});
