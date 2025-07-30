import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';
import tailwindcss from 'tailwindcss'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint({
  failOnError: false,
   failOnWarning: false  }), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
