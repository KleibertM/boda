import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        invitation: fileURLToPath(
          new URL('./boda_kleibert_sandy_invitaci_n_oficial.html', import.meta.url),
        ),
      },
    },
  },
})
