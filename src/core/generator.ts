export function generateTypedefCode(env: Record<string, string>) {
  const envProps = Object.keys(env).map((key) => `  readonly ${key}: string`)

  const codes = [
    `/// <reference types="vite/client" />`,
    ``,
    `interface ImportMeta {`,
    `  readonly env: ImportMetaEnv`,
    `}`,
    ``,
    `interface ImportMetaEnv {`,
    `  readonly VITE_APP_TITLE: string`,
    ...envProps,
    `}`,
  ]

  return codes.join('\n')
}
