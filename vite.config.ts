
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the specific Render host or all hosts
    allowedHosts: true, 
    host: true // Listen on all network interfaces
  },
  preview: {
    allowedHosts: true,
    host: true
  },
  define: {
    // Ensure API Key is available in the built application
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
