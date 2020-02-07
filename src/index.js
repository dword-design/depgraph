import variables from './variables.config'
import dot from './dot'
import depcruise from './depcruise'
import express from 'express'
import { spawn } from 'child-process-promise'

export default {
  css: [
    'assets/style.scss',
  ],
  cssVariables: variables,
  plugins: [
    '~/plugins/fontawesome.js',
  ],
  modules: [
    '@nuxtjs/axios',
    '~/modules/express-server-middleware.js',
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