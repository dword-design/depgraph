import baseConfigNuxt from '@dword-design/base-config-nuxt'
import P from 'path'

export default (options = {}) =>
  baseConfigNuxt.commands.start({
    log: options.log,
    rootDir: P.resolve(__dirname, '..'),
  })
