import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/main.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "react-redux"],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit']
  },
  build: { 
    target: "esnext",
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3001,
    cors: true,
    host: true,
  },
  preview: {
    port: 3001,
    cors: true,
    host: true,
  },
})
