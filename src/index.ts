import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { LoadEnvOptions, loadEnv, toArray } from './core'
import { generateTypedefCode, generateTypescriptCode } from './core/generator'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default createUnplugin<Options | undefined>((options) => {
  const opt: LoadEnvOptions = {
    cwd: process.cwd(),
    prefix: options?.prefix ? toArray(options.prefix) : undefined,
  }

  return {
    name: 'unplugin-env',
    async buildStart() {
      await generateFiles()
    },
    vite: {
      configResolved(config) {
        const prefix = toArray(config.envPrefix || [`VITE_`])
        opt.mode = config.mode
        opt.prefix = prefix
      },
    },
    webpack(compiler) {
      opt.mode = compiler.options.mode
    },
  }

  async function generateFiles() {
    const dtsFile = options?.dts || `env.d.ts`

    const env = loadEnv(opt)
    const code = generateTypedefCode(env)

    const filePath = join(opt.cwd, dtsFile)

    await writeFile(filePath, code)

    if (options?.envFile) {
      const envFilePath = join(opt.cwd, options.envFile)

      const code = generateTypescriptCode(env, opt.prefix)

      await writeFile(envFilePath, code)
    }
  }
})
