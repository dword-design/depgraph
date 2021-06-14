import { property } from '@dword-design/functions'
import axios from 'axios'
import execa from 'execa'
import { outputFile } from 'fs-extra'
import portReady from 'port-ready'
import stealthyRequire from 'stealthy-require-no-leak'
import kill from 'tree-kill-promise'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  before: () => execa.command('base prepublishOnly'),
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
