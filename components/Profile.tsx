
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { HabiticaUser } from '../types';

const Profile: React.FC = () => {
  const [user, setUser] = useLocalStorage<HabiticaUser | null>('habitica-user', null);
  const [userId, setUserId] = useState(user?.userId || '');
  const [apiToken, setApiToken] = useState(user?.apiToken || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser({ userId, apiToken });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-habitica-dark p-6 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-habitica-light">User Profile</h1>

      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-habitica-text-secondary mb-1">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full bg-[#3b2a5e] border border-habitica-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-habitica-light"
            placeholder="e.g., f3e1b5b0-a3a8-4c8d-8a21-12a8a8a4b8b8"
          />
        </div>
        <div>
          <label htmlFor="apiToken" className="block text-sm font-medium text-habitica-text-secondary mb-1">API Token</label>
          <input
            type="password"
            id="apiToken"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            className="w-full bg-[#3b2a5e] border border-habitica-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-habitica-light"
            placeholder="Enter your API Token"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-habitica-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {saved ? 'Credentials Saved!' : 'Save Credentials'}
        </button>
      </div>

      <div className="bg-[#3b2a5e] p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2 text-white">How to find your credentials</h2>
        <ol className="list-decimal list-inside space-y-2 text-habitica-text-secondary">
          <li>Log in to your <a href="https://habitica.com" target="_blank" rel="noopener noreferrer" className="text-habitica-light underline">Habitica</a> account.</li>
          <li>Click your user icon in the top-right corner.</li>
          <li>Go to <strong>Settings</strong> &gt; <strong>API</strong>.</li>
          <li>Your <strong>User ID</strong> will be displayed at the top.</li>
          <li>Click the <strong>Show API Token</strong> button to reveal your token.</li>
          <li>Copy and paste both values into the fields above.</li>
        </ol>
        <p className="mt-4 text-sm text-habitica-text-secondary">
          Your credentials are saved securely in your browser's local storage and are never sent to any server.
        </p>
      </div>
    </div>
  );
};

export default Profile;
