export interface Options {
  /**
   * generated env.ts file path, default is undefined
   */
  envFile?: string
  /**
   * d.ts file path, default is `env.d.ts`
   */
  dts?: string
  /**
   * vite: default is vite [envPrefix](https://vitejs.dev/config/shared-options.html#envprefix) option.
   *
   * other: undefined
   */
  prefix?: string | string[]
}
