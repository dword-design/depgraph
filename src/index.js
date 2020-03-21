import variables from './variables.config'
import dot from './dot'
import depcruise from './depcruise'
import execa from 'execa'
import verticalRhythmAtomizerPlugin from '@dword-design/atomizer-plugin-vertical-rhythm'
import autoprefixerAtomizerPlugin from '@dword-design/atomizer-plugin-autoprefixer'
import getPackageName from 'get-package-name'

export default {
  css: ['assets/style.scss'],
  loading: 'components/loading',
  modules: [
    getPackageName(require.resolve('@nuxtjs/axios')),
    [getPackageName(require.resolve('@dword-design/nuxt-express-server')), {
      routes: {
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
    }],
    [getPackageName(require.resolve('@dword-design/nuxt-atomizer')), {
      classNames: [],
      custom: variables,
      breakPoints: {
        sm: '@media (min-width: 576px)',
        md: '@media (min-width: 768px)',
        lg: '@media (min-width: 992px)',
        xl: '@media (min-width: 1200px)',
      },
      plugins: [
        verticalRhythmAtomizerPlugin(variables),
        autoprefixerAtomizerPlugin,
      ],
    }],
    getPackageName(require.resolve('nuxt-fontawesome')),
  ],
}
