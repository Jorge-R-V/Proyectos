import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Proyectos/proyectoGestorCalorias/",
  server: {
    proxy: {
      '/api-usda': {
        target: 'https://api.nal.usda.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-usda/, '')
      },
      '/api-off': {
        target: 'https://world.openfoodfacts.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-off/, '')
      }
    }
  }
})
