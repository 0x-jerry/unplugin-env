# Unplugin env

Auto generate typedef for env variables.

## Install

```bash
npm i @0x-jerry/unplugin-env
```

## Usage

### Vite

```ts
// vite.config.ts
import Env from '@0x-jerry/unplugin-env/vite'

export default defineConfig({
  plugins: [
    Env({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

### Webpack

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('@0x-jerry/unplugin-env/webpack')({
      /* options */
    }),
  ],
}
```
