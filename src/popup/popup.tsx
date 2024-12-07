import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BookmarkPlus, Settings } from 'lucide-react';
import { saveBookmark } from '../utils/github';
import { getCurrentTab } from '../utils/chrome';

function Popup() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCurrentPage = async () => {
      const tab = await getCurrentTab();
      if (tab?.title && tab?.url) {
        setTitle(tab.title);
        setUrl(tab.url);
      }
    };
    loadCurrentPage();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      await saveBookmark({ title, url, note });
      window.close();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Save Bookmark</h1>
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          <BookmarkPlus className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Bookmark'}
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('app')!).render(<Popup />);