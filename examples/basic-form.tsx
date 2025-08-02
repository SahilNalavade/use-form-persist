import React from 'react';
import { useFormPersist } from '../src';

interface ContactForm {
  name: string;
  email: string;
  message: string;
  subscribe: boolean;
}

export function BasicFormExample() {
  const { values, setValue, clearPersistedData, isHydrated } = useFormPersist<ContactForm>(
    'contact-form',
    {
      name: '',
      email: '',
      message: '',
      subscribe: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', values);
    
    alert('Form submitted successfully!');
    clearPersistedData();
  };

  if (!isHydrated) {
    return <div>Loading form...</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label htmlFor=\"name\">Name:</label>
          <input
            id=\"name\"
            type=\"text\"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            placeholder=\"Enter your name\"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div>
          <label htmlFor=\"email\">Email:</label>
          <input
            id=\"email\"
            type=\"email\"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            placeholder=\"Enter your email\"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div>
          <label htmlFor=\"message\">Message:</label>
          <textarea
            id=\"message\"
            value={values.message}
            onChange={(e) => setValue('message', e.target.value)}
            placeholder=\"Enter your message\"
            rows={4}
            style={{ width: '100%', padding: 8, marginTop: 4, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type=\"checkbox\"
              checked={values.subscribe}
              onChange={(e) => setValue('subscribe', e.target.checked)}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button type=\"submit\" style={{ flex: 1, padding: 10 }}>
            Submit
          </button>
          <button
            type=\"button\"
            onClick={clearPersistedData}
            style={{ flex: 1, padding: 10 }}
          >
            Clear Form
          </button>
        </div>
      </form>

      <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <h4>Current Values:</h4>
        <pre style={{ fontSize: 12, overflow: 'auto' }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  );
}