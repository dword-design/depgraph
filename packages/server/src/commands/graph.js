import { spawn } from 'child-process-promise'
import dot from '../dot'
import express from 'express'
import path from 'path'
import buildGraph from '../build-graph'

export default {
  name: 'graph',
  description: 'Output the dependency graph in the browser',
  handler: () => {
    const port = 4000
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
      .use(express.static(path.resolve(__dirname, 'client')))
      .get('/graph', (req, res) => buildGraph().then(graph => res.send(graph)))
      .get('/static', (req, res) => dot({ isClusters: req.query.clusters === 'true' })
        .then(dot => spawn(
          'dot',
          ['-T', 'svg', ...req.query.flow !== 'true' ? ['-K', 'neato'] : []],
          { capture: ['stdout'] },
        )
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

    app.listen(port)
    console.log(`Depgraph available at http://localhost:${port} …`)
  },
}
