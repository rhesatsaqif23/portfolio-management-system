import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value
  }
  process.env.TSS_SERVER_FN_BASE = '/_serverFn/'
  return {
    resolve: {
      tsconfigPaths: true,
      // Force a single copy of these packages to prevent
      // the @tanstack/store version conflict (0.9.3 vs 0.11.0)
      // that causes the "_nonReactive" TypeError in route preloading.
      dedupe: [
        '@tanstack/store',
        '@tanstack/react-store',
        '@tanstack/react-router',
        '@tanstack/react-query',
      ],
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})

export default config
