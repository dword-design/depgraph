import withLocalTmpDir from 'with-local-tmp-dir'
import stealthyRequire from 'stealthy-require'
import outputFiles from 'output-files'
import kill from 'tree-kill'
import portReady from 'port-ready'
import puppeteer from '@dword-design/puppeteer'
import { spawn } from 'child-process-promise'
import P from 'path'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'src/index.js': '',
  })
  const { nuxtConfigFilename } = stealthyRequire(require.cache, () => require('@dword-design/base-config-nuxt'))
  await spawn('nuxt', ['build', '--config-file', nuxtConfigFilename], { cwd: P.resolve(__dirname, '..', '..') })
  const graph = stealthyRequire(require.cache, () => require('../../src/graph'))
  const childProcess = graph({ log: true })
    .catch(error => {
      if (error.code !== null) {
        throw error
      }
    })
    .childProcess
  await portReady(3000)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000')
  expect(await page.content()).toMatch('Depgraph')
  await browser.close()
  kill(childProcess.pid)
})
