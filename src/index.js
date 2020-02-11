import variables from './variables.config'
import dot from './dot'
import depcruise from './depcruise'
import { spawn } from 'child-process-promise'
import expressServerMiddlewareModule from './modules/express-server-middleware'
import axiosModule from '@nuxtjs/axios'
import fontawesomeModule from 'nuxt-fontawesome'
import P from 'path'

export default {
  rootDir: P.resolve(__dirname, '..'),
  buildDir: P.resolve(__dirname, '..', 'dist', 'nuxt'),
  css: ['assets/style.scss'],
  cssVariables: variables,
  loading: '~/components/loading.js',
  modules: [
    axiosModule,
    expressServerMiddlewareModule,
    fontawesomeModule,
  ],
  expressServerMiddleware: {
    '/modules': async (req, res) => {
      res.send(await depcruise({ isDuplicated: req.query.duplicated === 'true' }))
    },
    '/dot': async (req, res) => {
      const dotCode = await dot({
        layoutName: req.query.layout,
        isDuplicated: req.query.duplicated === 'true',
        isClusters: req.query.clusters === 'true',
      })
      const { stdout: svgCode } = await spawn('dot', ['-T', 'svg'], { capture: ['stdout'] })
        .progress(({ stdin }) => {
          stdin.write(dotCode)
          stdin.end()
        })
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(svgCode)
    },
  },
}
