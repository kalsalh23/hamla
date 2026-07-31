import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @supabase/phoenix@0.4.x يعلن عن phoenix.mjs في exports لكن الملف غير منشور فعلياً
      '@supabase/phoenix': fileURLToPath(
        new URL('./node_modules/@supabase/phoenix/priv/static/phoenix.cjs.js', import.meta.url),
      ),
    },
  },
})
