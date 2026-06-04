import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'beentheredonethat' with your actual GitHub repo name.
// If deploying to a custom domain, set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/beentheredonethat/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
