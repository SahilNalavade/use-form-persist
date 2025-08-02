import React from 'react';
import { useFormPersist } from '../src';

interface UserProfile {
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
  };
  security: {
    password: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
  };
}

export function AdvancedFormExample() {
  const { values, setValue, setValues, clearPersistedData, isHydrated } = useFormPersist<UserProfile>(
    'user-profile',
    {
      personal: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      },
      contact: {
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          zipCode: '',
          country: 'US',
        },
      },
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        language: 'en',
      },
      security: {
        password: '',
        confirmPassword: '',
        twoFactorEnabled: false,
      },
    },
    {
      exclude: ['security.password', 'security.confirmPassword'], // Don't persist passwords
      debounceMs: 500, // Slower debounce for complex form
      onError: (error) => {
        console.error('Form persistence error:', error);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (values.security.password !== values.security.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Profile updated:', values);
    alert('Profile updated successfully!');
  };

  if (!isHydrated) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Personal Information */}
        <fieldset style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <legend>Personal Information</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>First Name:</label>
              <input
                type=\"text\"
                value={values.personal.firstName}
                onChange={(e) => setValue('personal', {
                  ...values.personal,
                  firstName: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type=\"text\"
                value={values.personal.lastName}
                onChange={(e) => setValue('personal', {
                  ...values.personal,
                  lastName: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Date of Birth:</label>
            <input
              type=\"date\"
              value={values.personal.dateOfBirth}
              onChange={(e) => setValue('personal', {
                ...values.personal,
                dateOfBirth: e.target.value
              })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
        </fieldset>

        {/* Contact Information */}
        <fieldset style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <legend>Contact Information</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Email:</label>
              <input
                type=\"email\"
                value={values.contact.email}
                onChange={(e) => setValue('contact', {
                  ...values.contact,
                  email: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type=\"tel\"
                value={values.contact.phone}
                onChange={(e) => setValue('contact', {
                  ...values.contact,
                  phone: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
          </div>
          
          <h4>Address</h4>
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              type=\"text\"
              placeholder=\"Street Address\"
              value={values.contact.address.street}
              onChange={(e) => setValue('contact', {
                ...values.contact,
                address: { ...values.contact.address, street: e.target.value }
              })}
              style={{ width: '100%', padding: 8 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <input
                type=\"text\"
                placeholder=\"City\"
                value={values.contact.address.city}
                onChange={(e) => setValue('contact', {
                  ...values.contact,
                  address: { ...values.contact.address, city: e.target.value }
                })}
                style={{ padding: 8 }}
              />
              <input
                type=\"text\"
                placeholder=\"ZIP Code\"
                value={values.contact.address.zipCode}
                onChange={(e) => setValue('contact', {
                  ...values.contact,
                  address: { ...values.contact.address, zipCode: e.target.value }
                })}
                style={{ padding: 8 }}
              />
              <select
                value={values.contact.address.country}
                onChange={(e) => setValue('contact', {
                  ...values.contact,
                  address: { ...values.contact.address, country: e.target.value }
                })}
                style={{ padding: 8 }}
              >
                <option value=\"US\">United States</option>
                <option value=\"CA\">Canada</option>
                <option value=\"UK\">United Kingdom</option>
                <option value=\"DE\">Germany</option>
                <option value=\"FR\">France</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Preferences */}
        <fieldset style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <legend>Preferences</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Theme:</label>
              <select
                value={values.preferences.theme}
                onChange={(e) => setValue('preferences', {
                  ...values.preferences,
                  theme: e.target.value as 'light' | 'dark'
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              >
                <option value=\"light\">Light</option>
                <option value=\"dark\">Dark</option>
              </select>
            </div>
            <div>
              <label>Language:</label>
              <select
                value={values.preferences.language}
                onChange={(e) => setValue('preferences', {
                  ...values.preferences,
                  language: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              >
                <option value=\"en\">English</option>
                <option value=\"es\">Spanish</option>
                <option value=\"fr\">French</option>
                <option value=\"de\">German</option>
              </select>
            </div>
          </div>
          
          <h4>Notifications</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(values.preferences.notifications).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type=\"checkbox\"
                  checked={value}
                  onChange={(e) => setValue('preferences', {
                    ...values.preferences,
                    notifications: {
                      ...values.preferences.notifications,
                      [key]: e.target.checked
                    }
                  })}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)} notifications
              </label>
            ))}
          </div>
        </fieldset>

        {/* Security */}
        <fieldset style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <legend>Security</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Password:</label>
              <input
                type=\"password\"
                value={values.security.password}
                onChange={(e) => setValue('security', {
                  ...values.security,
                  password: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type=\"password\"
                value={values.security.confirmPassword}
                onChange={(e) => setValue('security', {
                  ...values.security,
                  confirmPassword: e.target.value
                })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type=\"checkbox\"
                checked={values.security.twoFactorEnabled}
                onChange={(e) => setValue('security', {
                  ...values.security,
                  twoFactorEnabled: e.target.checked
                })}
              />
              Enable Two-Factor Authentication
            </label>
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button type=\"submit\" style={{ flex: 1, padding: 12, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Save Profile
          </button>
          <button
            type=\"button\"
            onClick={clearPersistedData}
            style={{ flex: 1, padding: 12, backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}