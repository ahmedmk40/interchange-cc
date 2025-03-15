"use client";

import { useState, useEffect } from 'react';
import DebugPanel from './DebugPanel';

type DebugProviderProps = {
  children: React.ReactNode;
  enabled?: boolean;
};

const DebugProvider = ({ children, enabled = true }: DebugProviderProps) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  
  // Initialize debug mode based on localStorage or query param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for debug mode in localStorage
    const storedDebugMode = localStorage.getItem('debug_mode');
    
    // Check for debug query parameter
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug') === 'true';
    
    // Enable debug if either is true AND the component is enabled via props
    setIsDebugEnabled(
      enabled && (storedDebugMode === 'true' || debugParam)
    );
    
    // If debug param is present, store the preference
    if (debugParam) {
      localStorage.setItem('debug_mode', 'true');
    }
    
    // Setup keyboard shortcut (Ctrl+Shift+D) to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const newValue = !isDebugEnabled;
        setIsDebugEnabled(newValue);
        localStorage.setItem('debug_mode', String(newValue));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isDebugEnabled]);
  
  return (
    <>
      {children}
      {isDebugEnabled && <DebugPanel initiallyOpen={false} />}
    </>
  );
};

export default DebugProvider;