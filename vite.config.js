import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ mode }) => {
  return {
    // yang lama hrusnya kesini
    // base: mode === "development" ? "/chlora/" : "/",

    // Test yang baru
    base: "/",
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
