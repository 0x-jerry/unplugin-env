import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

export interface LoadEnvOptions {
  cwd: string
  mode?: string
  /**
   * vite: default is vite [envPrefix](https://vitejs.dev/config/shared-options.html#envprefix) option.
   *
   * other: undefined
   */
  prefix?: string[]
}

export function loadEnv(opt: Partial<LoadEnvOptions> = {}) {
  const cwd = opt.cwd ?? process.cwd()
  const mode = opt.mode

  // https://vitejs.dev/guide/env-and-mode.html#env-files
  const envFiles = ['.env', '.env.local']

  if (mode) {
    envFiles.push(`.env.${mode}`, `.env.${mode}.local`)
  }

  const envFilePaths = envFiles.map((p) => join(cwd, p))

  const allEnv: Record<string, string> = {}

  for (const p of envFilePaths) {
    try {
      const env = load(p, {
        prefix: opt.prefix || [],
      })

      Object.assign(allEnv, env)
    } catch (error) {
      console.warn(`Load env file [${p}] failed:`, error)
    }
  }

  return allEnv
}

function load(path: string, opt: { prefix: string[] }) {
  if (!existsSync(path)) {
    return {}
  }

  const env = dotenv.config({
    path,
  })

  if (env.error) {
    throw env.error
  }

  const parsed = env.parsed || {}

  if (!opt.prefix.length) {
    return parsed
  }

  const filteredEnv: Record<string, string> = {}

  for (const key of Object.keys(parsed)) {
    const hasPrefix = opt.prefix.some((pre) => key.startsWith(pre))

    if (hasPrefix) {
      filteredEnv[key] = parsed[key]
    }
  }

  return filteredEnv
}

/**
 * Ensure to return a list of element T.
 *
 * @param arr
 * @returns
 */
export const toArray = <T>(arr: T | T[]): T[] => {
  return Array.isArray(arr) ? arr : [arr]
}
