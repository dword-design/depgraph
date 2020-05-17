import baseConfigNuxt from '@dword-design/base-config-nuxt'
import P from 'path'

export default ({ log = true } = {}) =>
  baseConfigNuxt.commands.start({ log, rootDir: P.resolve(__dirname, '..') })
