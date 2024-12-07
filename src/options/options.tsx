import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Github, Key, User, Database, CheckCircle, XCircle } from 'lucide-react';
import { testGitHubConnection } from '../utils/github';

function Options() {
  const [config, setConfig] = useState({
    token: '',
    username: '',
    repository: ''
  });
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['githubConfig'], (result) => {
      if (result.githubConfig) {
        setConfig(result.githubConfig);
      }
    });
  }, []);

  const saveConfig = async () => {
    try {
      setStatus('testing');
      setError('');
      
      await testGitHubConnection(config);
      await chrome.storage.sync.set({ githubConfig: config });
      
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Github className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            GitHub Configuration
          </h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Key className="w-4 h-4" />
              Personal Access Token
            </label>
            <input
              type="password"
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="ghp_..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              GitHub Username
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="username"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Database className="w-4 h-4" />
              Repository Name
            </label>
            <input
              type="text"
              value={config.repository}
              onChange={(e) => setConfig({ ...config, repository: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="bookmarks"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              Configuration saved successfully!
            </div>
          )}

          <button
            onClick={saveConfig}
            disabled={status === 'testing'}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {status === 'testing' ? 'Testing Connection...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('app')!).render(<Options />);