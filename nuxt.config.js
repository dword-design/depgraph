import execa from 'execa'
import depcruise from './model/depcruise'
import dot from './model/dot'
import sassJsImporter from '@dword-design/node-sass-js-importer'
import variables from './model/variables.config'
import themeModule from './modules/theme'

export default {
  name: 'Depgraph',
  modules: [
    ['@dword-design/nuxt-sass-importer', {
      importer: sassJsImporter,
    }],
    ['@dword-design/nuxt-express-server', {
      routes: {
        '/modules': async (req, res) => {
          res.send(
            await depcruise({ isDuplicated: req.query.duplicated === 'true' })
          )
        },
        '/dot': async (req, res) => {
          const dotCode = await dot({
            layoutName: req.query.layout,
            isDuplicated: req.query.duplicated === 'true',
            isClusters: req.query.clusters === 'true',
          })
          const childProcess = execa.command('dot -T svg', { all: true })
          childProcess.stdin.write(dotCode)
          childProcess.stdin.end()
          const { all: svgCode } = await childProcess
          res.setHeader('Content-Type', 'image/svg+xml')
          res.send(svgCode)
        },
      },
    }],
    'nuxt-fontawesome',
    [themeModule, variables],
  ],
}
