import depcruise from './depcruise'
import server from './server'
import { spawn } from 'child-process-promise'

export default () => server(app => app
  .get('/', (req, res) => depcruise({ outputType: 'dot' })
    .then(dot => spawn('dot', ['-T', 'svg'], { capture: ['stdout'] })
      .progress(({ stdin }) => {
        stdin.write(dot)
        stdin.end()
      })
    )
    .then(({ stdout: svgCode }) => {
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(svgCode)
    })
  )
)
