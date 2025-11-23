import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/api/ingest': {
                target: 'http://ingest-service:3000', // For local dev, might need adjustment or mocking
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/ingest/, '')
            },
            '/api/product': {
                target: 'http://product-service:3001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/product/, '')
            }
        }
    }
})
