"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [count, setCount] = useState(0);
  
  // Function to generate console logs
  const generateLogs = () => {
    console.log('Regular log message', { count });
    console.info('Info message from button click');
    console.warn('Warning: this is a test warning');
    console.error('Error: this is a test error');
    setCount(prev => prev + 1);
  };
  
  // Function to make a successful API request
  const makeSuccessfulRequest = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      console.log('Database connection test result:', data);
    } catch (error) {
      console.error('Failed to test database connection:', error);
    }
  };
  
  // Function to make a failed API request
  const makeFailedRequest = async () => {
    try {
      const response = await fetch('/api/non-existent-endpoint');
      const data = await response.json();
      console.log('This should not execute:', data);
    } catch (error) {
      console.error('Expected error from non-existent endpoint:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-6">Interchange CC</h1>
        <p className="text-center text-lg mb-4">
          Welcome to your Next.js application with Neon database integration!
        </p>
        
        <div className="text-center mb-8">
          <p className="mb-2">This template includes:</p>
          <ul className="list-disc inline-block text-left">
            <li>Next.js 14 with App Router</li>
            <li>TypeScript configuration</li>
            <li>Tailwind CSS styling</li>
            <li>Shadcn UI & Radix UI components</li>
            <li>Neon PostgreSQL database</li>
            <li>Browser debugging tools</li>
          </ul>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Browser Debugging Tools Demo</h2>
          
          <p className="mb-4 text-sm">
            Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+D</kbd> to toggle the debug panel, or use <code>?debug=true</code> in the URL.
          </p>
          
          <div className="flex flex-col gap-4 md:flex-row md:justify-center">
            <Button onClick={generateLogs} className="bg-blue-600 hover:bg-blue-700">
              Generate Console Logs
            </Button>
            
            <Button onClick={makeSuccessfulRequest} className="bg-green-600 hover:bg-green-700">
              Test Database Connection
            </Button>
            
            <Button onClick={makeFailedRequest} className="bg-red-600 hover:bg-red-700">
              Generate Network Error
            </Button>
          </div>
          
          {count > 0 && (
            <p className="mt-4 text-center">
              Logs generated: <span className="font-bold">{count}</span> time{count !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
