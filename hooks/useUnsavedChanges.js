'use client';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useUnsavedChanges(hasUnsavedChanges, message = 'You have unsaved changes. Are you sure you want to leave?') {
  const router = useRouter();

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, message]);

  const push = useCallback((...args) => {
    if (hasUnsavedChanges && !window.confirm(message)) {
      return;
    }
    router.push(...args);
  }, [hasUnsavedChanges, message, router]);

  const replace = useCallback((...args) => {
    if (hasUnsavedChanges && !window.confirm(message)) {
      return;
    }
    router.replace(...args);
  }, [hasUnsavedChanges, message, router]);

  const back = useCallback(() => {
    if (hasUnsavedChanges && !window.confirm(message)) {
      return;
    }
    router.back();
  }, [hasUnsavedChanges, message, router]);

  return { push, replace, back };
}
