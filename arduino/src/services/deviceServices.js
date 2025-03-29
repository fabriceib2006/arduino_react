// services/deviceServices.js
const API_BASE_URL = 'http://localhost:5000/api/devices';

const fetchDevices = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return response.json();
};

export default fetchDevices;
