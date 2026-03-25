import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUNDLED_DEV__: false,
    __SERVER_FORWARD_CONSOLE__: false
  },
  plugins: [svelte()],
  base: '/TekoBernElektrotechnik/',
  test: {
    environment: 'jsdom',
    exclude: ['tests/**', 'node_modules']
  }
})
