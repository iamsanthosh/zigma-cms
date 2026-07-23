'use client';
import { useEffect, useState } from 'react';

export default function FloatingActionBar({
  onSave,
  onPreview,
  onPublish,
  hasUnsavedChanges = false,
  saveLabel = 'Save',
  previewLabel = 'Preview',
  publishLabel = 'Publish',
  status = '',
  extraButtons = null
}) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      background: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb'
    }}>
      {hasUnsavedChanges && (
        <span style={{ fontSize: '0.85rem', color: '#F59E0B', marginRight: '0.5rem' }}>
          Unsaved changes
        </span>
      )}
      {status && (
        <span style={{ fontSize: '0.85rem', color: '#0C8A50', marginRight: '0.5rem' }}>
          {status}
        </span>
      )}
      {onPreview && (
        <button className="admin-btn admin-btn-ghost" onClick={onPreview}>
          {previewLabel}
        </button>
      )}
      {onPublish && (
        <button className="admin-btn admin-btn-primary" onClick={onPublish}>
          {publishLabel}
        </button>
      )}
      {extraButtons}
      {onSave && (
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : saveLabel}
        </button>
      )}
    </div>
  );
}
