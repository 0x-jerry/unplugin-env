import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { LoadEnvOptions, loadEnv, toArray } from './core'
import { generateTypedefCode } from './core/generator'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default createUnplugin<Options | undefined>((options) => {
  const opt: LoadEnvOptions = {
    cwd: process.cwd(),
    prefix: options?.prefix ? toArray(options.prefix) : undefined,
  }

  return {
    name: 'unplugin-env',
    vite: {
      async configResolved(config) {
      const prefix = toArray(config.envPrefix || [`VITE_`])
        opt.mode = config.mode
        opt.prefix = prefix

        await generateEnvDts()
      },
    },
    webpack(compiler) {
      opt.mode = compiler.options.mode
    },
  }

  async function generateEnvDts() {
    const dtsFile = options?.dts || `env.d.ts`

    const env = loadEnv(opt)
    const code = generateTypedefCode(env)

    const filePath = join(opt.cwd, dtsFile)

    await writeFile(filePath, code)
  }
})
