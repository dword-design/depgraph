import withLocalTmpDir from 'with-local-tmp-dir'
import stealthyRequire from 'stealthy-require'
import { outputFile } from 'fs-extra'
import kill from 'tree-kill-promise'
import portReady from 'port-ready'
import P from 'path'
import axios from 'axios'
import { property } from '@dword-design/functions'
import { Nuxt, Builder } from 'nuxt'
import config from '../nuxt.config'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFile('src/index.js', '')
      const nuxt = new Nuxt({
        ...config,
        build: { ...config.build, quiet: true },
        rootDir: P.resolve(__dirname, '..'),
      })
      await new Builder(nuxt).build()
      const graph = stealthyRequire(require.cache, () => require('./graph'))
      const childProcess = graph({ log: true })
      await portReady(3000)
      expect(
        axios.get('http://localhost:3000') |> await |> property('data')
      ).toMatch('Depgraph')
      await kill(childProcess.pid)
    }),
}
