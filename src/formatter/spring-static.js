import server from '../server'
import { spawn } from 'child-process-promise'
import dotFlat from '../dot-flat'

export const name = 'spring-static'
export const handler = () => server(app => app
  .get('/', (req, res) => dotFlat()
    .then(dot => spawn('dot', ['-T', 'svg', '-K', 'neato'], { capture: ['stdout'] })
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
