import { spawn } from 'child-process-promise'
import dot from '../dot'
import express from 'express'
import P from 'path'
import buildGraph from '../build-graph'

export default {
  name: 'graph',
  description: 'Output the dependency graph in the browser',
  handler: () => {
    const port = 4000
    const clientPath = P.dirname(require.resolve('@dword-design/depgraph-client'))
    const app = express()
      .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Credentials', true)
        next()
      })
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(express.static(clientPath))
      .get('/graph', async (req, res) => {
        const graph = await buildGraph()
        res.send(graph)
      })
      .get('/static', async (req, res) => {
        const dotCode = await dot({ isClusters: req.query.clusters === 'true' })
        const { stdout: svgCode } = await spawn(
          'dot',
          ['-T', 'svg', ...req.query.flow !== 'true' ? ['-K', 'neato'] : []],
          { capture: ['stdout'] },
        )
          .progress(({ stdin }) => {
            stdin.write(dotCode)
            stdin.end()
          })
        res.setHeader('Content-Type', 'image/svg+xml')
        res.send(svgCode)
      })

    app.listen(port)
    console.log(`Depgraph available at http://localhost:${port} …`)
  },
}
