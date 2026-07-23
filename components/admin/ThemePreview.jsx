'use client';
import { useTheme } from '@/lib/ThemeProvider';

export default function ThemePreview() {
  const { themeSettings, isDarkMode } = useTheme();

  const previewSections = [
    {
      title: 'Hero Section',
      component: (
        <div style={{
          background: themeSettings['--navy-950'] || '#0A1628',
          color: themeSettings['--white'] || '#FFFFFF',
          padding: '3rem',
          borderRadius: 'var(--admin-radius-lg)',
        }}>
          <div style={{
            fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            Welcome to Your Website
          </div>
          <div style={{
            color: themeSettings['--graphite-500'] || '#5B6472',
            marginBottom: '2rem',
            fontSize: '1.1rem',
          }}>
            This is a preview of how your theme will look on the live site.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: themeSettings['--orange'] || '#FF6B1A',
              color: themeSettings['--white'] || '#FFFFFF',
              padding: '0.95rem 1.8rem',
              borderRadius: '2px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}>
              Get Started
            </button>
            <button style={{
              background: 'transparent',
              color: themeSettings['--white'] || '#FFFFFF',
              padding: '0.95rem 1.8rem',
              borderRadius: '2px',
              fontWeight: 600,
              border: '1.5px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
            }}>
              Learn More
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Feature Cards',
      component: (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              background: themeSettings['--white'] || '#FFFFFF',
              border: `1px solid ${themeSettings['--gray-200'] || '#E7EBF1'}`,
              borderRadius: '10px',
              padding: '1.5rem',
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '9px',
                background: themeSettings['--navy-950'] || '#0A1628',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: themeSettings['--cyan'] || '#00D4FF',
                  borderRadius: '50%',
                }} />
              </div>
              <div style={{
                fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: themeSettings['--graphite-800'] || '#1E2530',
              }}>
                Feature {i}
              </div>
              <div style={{
                fontSize: '0.86rem',
                color: themeSettings['--graphite-500'] || '#5B6472',
              }}>
                Description of the feature goes here with supporting details.
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Typography',
      component: (
        <div style={{
          background: themeSettings['--white'] || '#FFFFFF',
          padding: '2rem',
          borderRadius: 'var(--admin-radius-lg)',
          border: `1px solid ${themeSettings['--gray-200'] || '#E7EBF1'}`,
        }}>
          <h1 style={{
            fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: themeSettings['--graphite-800'] || '#1E2530',
          }}>
            Heading 1
          </h1>
          <h2 style={{
            fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: themeSettings['--graphite-800'] || '#1E2530',
          }}>
            Heading 2
          </h2>
          <h3 style={{
            fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: themeSettings['--graphite-800'] || '#1E2530',
          }}>
            Heading 3
          </h3>
          <p style={{
            fontFamily: themeSettings['--font-body'] || "'Inter', sans-serif",
            fontSize: '1rem',
            lineHeight: 1.6,
            color: themeSettings['--graphite-500'] || '#5B6472',
            marginBottom: '1rem',
          }}>
            This is body text using the primary font family. It should be readable and comfortable for long-form content.
          </p>
          <p style={{
            fontFamily: themeSettings['--font-mono'] || "'IBM Plex Mono', monospace",
            fontSize: '0.9rem',
            color: themeSettings['--cyan'] || '#00D4FF',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            MONO TEXT FOR LABELS AND TAGS
          </p>
        </div>
      )
    },
    {
      title: 'Color Palette',
      component: (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '0.5rem',
        }}>
          {Object.entries(themeSettings).filter(([key]) => key.startsWith('--')).slice(0, 12).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                background: value,
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                marginBottom: '0.5rem',
              }} />
              <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                {key.replace('--', '')}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Admin Panel Preview',
      component: (
        <div style={{
          background: isDarkMode ? '#1A1A1A' : themeSettings['--admin-bg'] || '#F4F6F9',
          padding: '1.5rem',
          borderRadius: 'var(--admin-radius-lg)',
        }}>
          <div style={{
            background: isDarkMode ? '#2A2A2A' : themeSettings['--admin-card-bg'] || '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#3A3A3A' : themeSettings['--admin-card-border'] || '#E7EBF1'}`,
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1rem',
          }}>
            <div style={{
              fontFamily: themeSettings['--font-display'] || "'Space Grotesk', sans-serif",
              fontSize: '1.6rem',
              marginBottom: '1rem',
              color: isDarkMode ? '#FFFFFF' : themeSettings['--admin-text-primary'] || '#1E2530',
            }}>
              Admin Dashboard
            </div>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <button style={{
                background: themeSettings['--admin-primary'] || '#FF6B1A',
                color: '#FFFFFF',
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}>
                Primary Action
              </button>
              <button style={{
                background: isDarkMode ? '#2A2A2A' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : themeSettings['--admin-text-primary'] || '#1E2530',
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                border: `1px solid ${isDarkMode ? '#3A3A3A' : themeSettings['--admin-card-border'] || '#E7EBF1'}`,
                cursor: 'pointer',
              }}>
                Secondary
              </button>
            </div>
            <div style={{
              background: isDarkMode ? '#1A1A1A' : '#F9FAFB',
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid ${isDarkMode ? '#3A3A3A' : themeSettings['--admin-card-border'] || '#E7EBF1'}`,
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: isDarkMode ? '#B0B0B0' : themeSettings['--admin-text-secondary'] || '#5B6472' }}>
                Input Field
              </div>
              <input
                type="text"
                placeholder="Enter text..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  border: `1px solid ${isDarkMode ? '#3A3A3A' : themeSettings['--admin-input-border'] || '#E7EBF1'}`,
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  background: isDarkMode ? '#2A2A2A' : '#FFFFFF',
                  color: isDarkMode ? '#FFFFFF' : themeSettings['--admin-text-primary'] || '#1E2530',
                }}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <h2 className="admin-h2" style={{ marginBottom: '1.5rem' }}>Theme Preview</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {previewSections.map((section, index) => (
          <div key={index}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
              {section.title}
            </h3>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
}
