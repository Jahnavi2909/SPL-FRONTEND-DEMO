import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL
  const proxyConfig = apiTarget
    ? {
        target: apiTarget,
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', apiTarget)
            proxyReq.setHeader('referer', `${apiTarget}/`)
          })
        },
      }
    : undefined

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: proxyConfig
      ? {
          proxy: {
            '/api': proxyConfig,
            '/media': proxyConfig,
          },
        }
      : undefined,
  }
})
