import server from '../server'
import { spawn } from 'child-process-promise'
import dot from '../dot'

export const name = 'flow'
export const description = 'Output the dependency graph using flow layout'
export const options = [
  { name: '-c, --cluster', description: 'Use the folder structure to generate clusters' },
]
export const handler = ({ cluster: isClusters }) => server(app => app
  .get('/', (req, res) => dot({ isClusters })
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
