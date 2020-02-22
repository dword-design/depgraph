import variables from './variables.config'
import dot from './dot'
import depcruise from './depcruise'
import execa from 'execa'
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
      const childProcess = execa.command('dot -T svg', { all: true })
      childProcess.stdin.write(dotCode)
      childProcess.stdin.end()
      const { all: svgCode } = await childProcess
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(svgCode)
    },
  },
}
