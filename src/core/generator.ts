import { name } from '../../package.json'

export function generateTypedefCode(env: Record<string, string>) {
  const envProps = Object.keys(env).map((key) => `  readonly ${key}: string`)

  const codes = [
    `/// <reference types="vite/client" />`,
    `// This file is auto-generated by ${name}, please do not edit it directly.`,
    `// @ts-nocheck`,
    ``,
    `interface ImportMeta {`,
    `  readonly env: ImportMetaEnv`,
    `}`,
    ``,
    `interface ImportMetaEnv {`,
    ...envProps,
    `}`,
  ]

  return codes.join('\n')
}

export function generateTypescriptCode(env: Record<string, string>, prefix?: string[]) {
  const envProps = Object.keys(env).map(
    (key) => `export const ${removePrefix(key, prefix)} =  import.meta.env.${key}`,
  )

  const codes = [
    `// This file is auto-generated by ${name}, please do not edit it directly.`,
    `// @ts-nocheck`,
    '',
    ...envProps,
  ]

  return codes.join('\n')
}

function removePrefix(s: string, prefix: string[] = []) {
  for (const pre of prefix) {
    if (s.startsWith(pre)) {
      return s.slice(pre.length)
    }
  }
}
