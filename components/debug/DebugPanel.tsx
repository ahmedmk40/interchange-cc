"use client";

import { useState, useEffect } from 'react';
import { debugUtils, type LogEntry } from '@/lib/browserUtils';
import { X, ChevronUp, ChevronDown, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';

type DebugPanelProps = {
  initiallyOpen?: boolean;
};

const DebugPanel = ({ initiallyOpen = false }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [activeTab, setActiveTab] = useState<'logs' | 'network'>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [successfulRequests, setSuccessfulRequests] = useState<any[]>([]);
  const [failedRequests, setFailedRequests] = useState<any[]>([]);

  // Refresh logs and network requests
  const refreshData = () => {
    setLogs(debugUtils.getLogs());
    setSuccessfulRequests(debugUtils.getSuccessfulRequests());
    setFailedRequests(debugUtils.getFailedRequests());
  };

  // Clear all logs and requests
  const clearAll = () => {
    debugUtils.clearAll();
    refreshData();
  };

  // Refresh data every 2 seconds
  useEffect(() => {
    if (isOpen) {
      refreshData();
      const interval = setInterval(refreshData, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center"
        aria-label="Open debug panel"
      >
        <Info size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-50 max-h-[50vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Debug Panel</h2>
          <button 
            onClick={refreshData}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={clearAll}
            className="p-1 rounded hover:bg-gray-700 transition-colors text-xs"
          >
            Clear All
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Close debug panel"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Close debug panel"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'logs' ? 'bg-gray-800 border-b-2 border-blue-500' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs ({logs.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'network' ? 'bg-gray-800 border-b-2 border-blue-500' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTab('network')}
        >
          Network ({successfulRequests.length + failedRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {activeTab === 'logs' && (
          <div className="space-y-1">
            {logs.length === 0 && (
              <div className="text-gray-400 text-center py-4">No logs to display</div>
            )}
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`p-2 rounded text-sm ${getLogBackground(log.level)}`}
              >
                <div className="flex items-start gap-2">
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-mono text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`text-xs px-1 rounded ${getLogBadgeColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-mono">{log.message}</div>
                    {log.data && (
                      <pre className="text-xs mt-1 bg-gray-800 p-1 rounded overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'network' && (
          <div>
            {successfulRequests.length === 0 && failedRequests.length === 0 && (
              <div className="text-gray-400 text-center py-4">No network requests to display</div>
            )}
            
            {failedRequests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
                  <AlertCircle size={14} /> Failed Requests ({failedRequests.length})
                </h3>
                <div className="space-y-1">
                  {failedRequests.map((req, index) => (
                    <div key={index} className="bg-red-900/20 border border-red-800 p-2 rounded text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">{req.method} {req.url}</span>
                        <span className="text-xs text-gray-400">{req.duration}ms</span>
                      </div>
                      {req.error && (
                        <div className="text-red-400 mt-1">{req.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {successfulRequests.length > 0 && (
              <div>
                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
                  <CheckCircle size={14} /> Successful Requests ({successfulRequests.length})
                </h3>
                <div className="space-y-1">
                  {successfulRequests.map((req, index) => (
                    <div key={index} className="bg-green-900/20 border border-green-800 p-2 rounded text-sm">
                      <div className="flex justify-between">
                        <span className="font-mono">{req.method} {req.url}</span>
                        <span className="text-xs text-gray-400">{req.duration}ms</span>
                      </div>
                      <div className="text-xs mt-1">
                        Status: <span className="text-green-400">{req.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions to style logs based on level
function getLogBackground(level: LogEntry['level']) {
  switch (level) {
    case 'error': return 'bg-red-950 border border-red-800';
    case 'warn': return 'bg-yellow-950 border border-yellow-800';
    case 'info': return 'bg-blue-950 border border-blue-800';
    case 'debug': return 'bg-gray-800 border border-gray-700';
    default: return 'bg-gray-800 border border-gray-700';
  }
}

function getLogBadgeColor(level: LogEntry['level']) {
  switch (level) {
    case 'error': return 'bg-red-800';
    case 'warn': return 'bg-yellow-800';
    case 'info': return 'bg-blue-800';
    case 'debug': return 'bg-gray-700';
    default: return 'bg-gray-700';
  }
}

function getLogIcon(level: LogEntry['level']) {
  switch (level) {
    case 'error': return <AlertCircle className="text-red-400" size={16} />;
    case 'warn': return <AlertCircle className="text-yellow-400" size={16} />;
    case 'info': return <Info className="text-blue-400" size={16} />;
    case 'debug': return <Info className="text-gray-400" size={16} />;
    default: return <Info className="text-gray-400" size={16} />;
  }
}

export default DebugPanel;