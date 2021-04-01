import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import execa from 'execa'
import outputFiles from 'output-files'
import portReady from 'port-ready'
import kill from 'tree-kill-promise'
import withLocalTmpDir from 'with-local-tmp-dir'

import graph from '@/model/graph'

export default tester(
  {
    async works() {
      await outputFiles({
        src: {
          'foo.js': '',
          'index.js': "import from './foo'",
        },
      })
      await this.page.setViewport({
        height: 875,
        width: 1400,
      })
      await this.page.goto('http://localhost:3000/dagre')
      expect(
        await this.page.screenshot({ fullPage: true })
      ).toMatchImageSnapshot(this)
    },
  },
  [
    {
      before: () => execa.command('base prepublishOnly'),
    },
    testerPluginPuppeteer(),
    {
      transform: test =>
        function () {
          return withLocalTmpDir(async () => {
            const childProcess = graph({ log: true })
            await portReady(3000)
            await test.call(this)
            await kill(childProcess.pid)
          })
        },
    },
  ]
)
