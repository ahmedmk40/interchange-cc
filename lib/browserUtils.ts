/**
 * Browser Debugging Utilities
 * 
 * This file contains utility functions for debugging and monitoring in the browser.
 * These functions are meant to be used in the client-side code only.
 */

// Type for log entry
export interface LogEntry {
  timestamp: string;
  message: string;
  data?: any;
  level: 'info' | 'warn' | 'error' | 'debug';
}

// Store for browser logs
class BrowserLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Only run in browser environment
      this.setupConsoleOverrides();
    }
  }
  
  private setupConsoleOverrides() {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    // Override console.log
    console.log = (...args: any[]) => {
      this.addLog('info', args[0], args.slice(1));
      originalConsole.log.apply(console, args);
    };
    
    // Override console.warn
    console.warn = (...args: any[]) => {
      this.addLog('warn', args[0], args.slice(1));
      originalConsole.warn.apply(console, args);
    };
    
    // Override console.error
    console.error = (...args: any[]) => {
      this.addLog('error', args[0], args.slice(1));
      originalConsole.error.apply(console, args);
    };
    
    // Override console.debug
    console.debug = (...args: any[]) => {
      this.addLog('debug', args[0], args.slice(1));
      originalConsole.debug.apply(console, args);
    };
  }
  
  private addLog(level: LogEntry['level'], message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
      data: data,
      level
    };
    
    this.logs.unshift(logEntry); // Add to beginning of array
    
    // Trim logs to max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  // Get logs by level
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  // Clear all logs
  clearLogs() {
    this.logs = [];
  }
}

// Network monitoring
class NetworkMonitor {
  private successfulRequests: any[] = [];
  private failedRequests: any[] = [];
  private maxRequests: number = 50;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.setupFetchOverride();
    }
  }
  
  private setupFetchOverride() {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.url;
      
      try {
        const response = await originalFetch(input, init);
        const duration = Date.now() - startTime;
        
        const requestInfo = {
          url,
          method: init?.method || 'GET',
          status: response.status,
          duration,
          timestamp: new Date().toISOString(),
          headers: init?.headers
        };
        
        if (response.ok) {
          this.addSuccessRequest(requestInfo);
        } else {
          this.addFailedRequest(requestInfo);
        }
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        this.addFailedRequest({
          url,
          method: init?.method || 'GET',
          error: error instanceof Error ? error.message : String(error),
          duration,
          timestamp: new Date().toISOString(),
          headers: init?.headers
        });
        
        throw error;
      }
    };
  }
  
  private addSuccessRequest(requestInfo: any) {
    this.successfulRequests.unshift(requestInfo);
    if (this.successfulRequests.length > this.maxRequests) {
      this.successfulRequests = this.successfulRequests.slice(0, this.maxRequests);
    }
  }
  
  private addFailedRequest(requestInfo: any) {
    this.failedRequests.unshift(requestInfo);
    if (this.failedRequests.length > this.maxRequests) {
      this.failedRequests = this.failedRequests.slice(0, this.maxRequests);
    }
  }
  
  getSuccessfulRequests() {
    return [...this.successfulRequests];
  }
  
  getFailedRequests() {
    return [...this.failedRequests];
  }
  
  clearRequests() {
    this.successfulRequests = [];
    this.failedRequests = [];
  }
}

// Create singleton instances
export const browserLogger = typeof window !== 'undefined' ? new BrowserLogger() : null;
export const networkMonitor = typeof window !== 'undefined' ? new NetworkMonitor() : null;

// Export utility functions that can be called from anywhere in the application
export const debugUtils = {
  getLogs: () => browserLogger?.getLogs() || [],
  getErrorLogs: () => browserLogger?.getLogsByLevel('error') || [],
  getSuccessfulRequests: () => networkMonitor?.getSuccessfulRequests() || [],
  getFailedRequests: () => networkMonitor?.getFailedRequests() || [],
  clearAll: () => {
    browserLogger?.clearLogs();
    networkMonitor?.clearRequests();
  }
};
