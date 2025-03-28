//components/settingServices.jsx
// This file contains the settings service functions for fetching and updating settings
import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSetting } from '../services/settingsServices';

function SettingsPanel() {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch settings on component mount
    fetchSettings()
      .then((data) => setSettings(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleUpdate = (id, key, value) => {
    updateSetting(id, key, value)
      .then(() => {
        // Refresh settings after update
        return fetchSettings();
      })
      .then((data) => setSettings(data))
      .catch((err) => setError(err.message));
  };

  return (
    <div>
      <h1>Settings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {settings.map((setting) => (
          <li key={setting.id}>
            <strong>{setting.setting_key}:</strong> {setting.setting_value}
            <button onClick={() => handleUpdate(setting.id, setting.setting_key, 'New Value')}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SettingsPanel;