import sassJsImporter from '@dword-design/node-sass-js-importer'
import execa from 'execa'

import depcruise from './model/depcruise'
import dot from './model/dot'
import variables from './model/variables.config'
import themeModule from './modules/theme'

export default {
  modules: [
    [
      '@dword-design/nuxt-sass-importer',
      {
        importer: sassJsImporter,
      },
    ],
    [
      '@dword-design/nuxt-express-server',
      {
        routes: {
          '/dot': async (req, res) => {
            const dotCode = await dot({
              isClusters: req.query.clusters === 'true',
              isDuplicated: req.query.duplicated === 'true',
              layoutName: req.query.layout,
            })
            const childProcess = execa.command('dot -T svg', { all: true })
            childProcess.stdin.write(dotCode)
            childProcess.stdin.end()
            const output = await childProcess
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(output.all)
          },
          '/modules': async (req, res) => {
            res.send(
              await depcruise({ isDuplicated: req.query.duplicated === 'true' })
            )
          },
        },
      },
    ],
    'nuxt-fontawesome',
    [themeModule, variables],
  ],
  name: 'Depgraph',
}
