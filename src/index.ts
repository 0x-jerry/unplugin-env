import { createUnplugin, type UnpluginInstance } from 'unplugin'
import type { Options } from './types'
import { type LoadEnvOptions, loadEnv, toArray } from './core'
import { generateTypedefCode, generateTypescriptCode } from './core/generator'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const plugin: UnpluginInstance<Options | undefined> = createUnplugin((options) => {
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

    await writeFileIfChanged(filePath, code)

    if (options?.envFile) {
      const envFilePath = join(opt.cwd, options.envFile)

      const code = generateTypescriptCode(env, opt.prefix)

      await writeFileIfChanged(envFilePath, code)
    }
  }
})

async function writeFileIfChanged(filepath: string, code: string) {
  let existsCode = ''

  if (existsSync(filepath)) {
    existsCode = await readFile(filepath, 'utf8')
  }

  if (existsCode !== code) {
    await writeFile(filepath, code)
  }
}

export default plugin
