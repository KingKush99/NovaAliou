import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __IAP_PROVIDER__: JSON.stringify(process.env.VITE_IAP_PROVIDER || ''),
  },
  server: {
    host: true,
    port: 2997
  }
})
