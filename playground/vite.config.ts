import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Env from '../src/vite'

export default defineConfig({
  envPrefix: ['TT_'],
  plugins: [
    Inspect(),
    Env({
      dts: 'env.d.ts',
    }),
  ],
})
