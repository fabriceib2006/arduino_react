import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
      RECORDING_SERVER_URL: process.env.RECORDING_SERVER_URL || `http://localhost:${process.env.RECORDING_SERVER_PORT || 3000}`,
    },
  },
})
