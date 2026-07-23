'use client';
import { useEffect, useState } from 'react';

export default function ThemeLivePreview({ colors, typography }) {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    // Convert colors to usable format
    const colorMap = {};
    if (colors) {
      Object.values(colors).flat().forEach(c => {
        colorMap[c.color_name] = c.color_value;
      });
    }
    setPreviewData({ colors: colorMap, typography });
  }, [colors, typography]);

  if (!previewData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading preview...</div>;
  }

  const { colors: colorMap } = previewData;

  return (
    <div style={{ 
      padding: '1.5rem', 
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Live Preview</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Hero Section Preview */}
        <HeroPreview colors={colorMap} />
        
        {/* Buttons Preview */}
        <ButtonsPreview colors={colorMap} />
        
        {/* Cards Preview */}
        <CardsPreview colors={colorMap} />
        
        {/* Typography Preview */}
        <TypographyPreview colors={colorMap} typography={previewData.typography} />
        
        {/* Form Elements Preview */}
        <FormPreview colors={colorMap} />
        
        {/* Status Badges Preview */}
        <StatusPreview colors={colorMap} />
      </div>
    </div>
  );
}

function HeroPreview({ colors }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Hero Section
      </h4>
      <div style={{
        background: colors['primary'] || '#2563EB',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Welcome to Your Website
        </h2>
        <p style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
          This is how your hero section will appear with the current theme.
        </p>
        <button style={{
          background: colors['accent'] || '#0EA5E9',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </div>
  );
}

function ButtonsPreview({ colors }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Buttons
      </h4>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button style={{
          background: colors['primary'] || '#2563EB',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Primary
        </button>
        <button style={{
          background: colors['secondary'] || '#64748B',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Secondary
        </button>
        <button style={{
          background: colors['accent'] || '#0EA5E9',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Accent
        </button>
        <button style={{
          background: 'transparent',
          color: colors['primary'] || '#2563EB',
          padding: '0.75rem 1.5rem',
          border: `2px solid ${colors['primary'] || '#2563EB'}`,
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Outline
        </button>
      </div>
    </div>
  );
}

function CardsPreview({ colors }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Cards
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            background: '#ffffff',
            border: `1px solid ${colors['border-primary'] || '#E2E8F0'}`,
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: colors['accent'] || '#0EA5E9',
              marginBottom: '1rem'
            }} />
            <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Feature {i}
            </h5>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              Description of the feature with supporting details.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographyPreview({ colors, typography }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Typography
      </h4>
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${colors['border-primary'] || '#E2E8F0'}` }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: colors['text-primary'] || '#0F172A' }}>
          Heading 1
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: colors['text-primary'] || '#0F172A' }}>
          Heading 2
        </h2>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: colors['text-primary'] || '#0F172A' }}>
          Heading 3
        </h3>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem', color: colors['text-secondary'] || '#475569' }}>
          This is body text. It should be readable and comfortable for long-form content. The quick brown fox jumps over the lazy dog.
        </p>
        <p style={{ fontSize: '0.875rem', color: colors['text-tertiary'] || '#94A3B8' }}>
          This is caption text for smaller details and metadata.
        </p>
      </div>
    </div>
  );
}

function FormPreview({ colors }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Form Elements
      </h4>
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${colors['border-primary'] || '#E2E8F0'}` }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: colors['text-primary'] || '#0F172A' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors['border-secondary'] || '#CBD5E1'}`,
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: colors['text-primary'] || '#0F172A' }}>
            Message
          </label>
          <textarea
            placeholder="Your message..."
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors['border-secondary'] || '#CBD5E1'}`,
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>
        <button style={{
          background: colors['primary'] || '#2563EB',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Submit
        </button>
      </div>
    </div>
  );
}

function StatusPreview({ colors }) {
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>
        Status Indicators
      </h4>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{
          background: colors['success'] || '#10B981',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          Success
        </div>
        <div style={{
          background: colors['warning'] || '#F59E0B',
          color: '#000000',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          Warning
        </div>
        <div style={{
          background: colors['error'] || '#EF4444',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          Error
        </div>
        <div style={{
          background: colors['info'] || colors['accent'] || '#3B82F6',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          Info
        </div>
      </div>
    </div>
  );
}
