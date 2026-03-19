import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  clean: true,
  platform: 'node',
  exports: true
})
