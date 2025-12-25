import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
const extraConfig = process.env.NODE_ENV === 'production' ? {
  // base: '/baby-chocoflix/',
} : {}
console.log('Using base: ' + (extraConfig.base || '<default>'))
export default defineConfig({
  ...extraConfig,
  plugins: [vue()],
})
