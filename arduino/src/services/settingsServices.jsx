//settingServices.jsx
const API_BASE_URL = 'http://localhost:5000/api/settings';

// Fetch all settings
export const fetchSettings = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
};

// Update a setting (optional, if needed)
export const updateSetting = async (id, settingKey, settingValue) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ setting_key: settingKey, setting_value: settingValue }),
  });
  if (!response.ok) {
    throw new Error('Failed to update setting');
  }
  return response.json();
};