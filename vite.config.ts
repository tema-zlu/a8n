import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.CI ? '/a8n/' : undefined,
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss()],
})
