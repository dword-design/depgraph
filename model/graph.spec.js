import withLocalTmpDir from 'with-local-tmp-dir'
import stealthyRequire from 'stealthy-require'
import { outputFile } from 'fs-extra'
import kill from 'tree-kill-promise'
import portReady from 'port-ready'
import axios from 'axios'
import { property } from '@dword-design/functions'
import { Nuxt, Builder } from 'nuxt'
import baseConfigNuxt from '@dword-design/base-config-nuxt'

const { nuxtConfig } = baseConfigNuxt

export default {
  before: async () => {
    const nuxt = new Nuxt({
      ...nuxtConfig,
      dev: false,
      build: { ...nuxtConfig.build, quiet: true },
    })
    await new Builder(nuxt).build()
  },
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFile('src/index.js', '')
      const graph = stealthyRequire(require.cache, () => require('./graph'))
      const childProcess = graph({ log: true })
      await portReady(3000)
      expect(
        axios.get('http://localhost:3000') |> await |> property('data')
      ).toMatch('Depgraph')
      await kill(childProcess.pid)
    }),
}
