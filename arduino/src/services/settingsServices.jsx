// services/settingsServices.js

// Fetch all settings
export const fetchSettings = async () => {
  const response = await fetch('http://localhost:5000/api/settings');
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
};

// Update a setting
export const updateSetting = async (id, key, value) => {
  const response = await fetch(`http://localhost:5000/api/settings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ setting_key: key, setting_value: value }),
  });
  if (!response.ok) {
    throw new Error('Failed to update setting');
  }
  return response.json();
};

// Delete a setting
export const deleteSetting = async (id) => {
  const response = await fetch(`http://localhost:5000/api/settings/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete setting');
  }
  return response.json();
};