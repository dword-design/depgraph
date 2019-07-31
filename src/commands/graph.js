import { spawn } from 'child-process-promise'
import dot from '../dot'
import express from 'express'
import path from 'path'
import depcruise from '../depcruise'
import { map, flatMap } from '@functions'
import open from 'open'

export const name = 'graph'
export const description = 'Output the dependency graph in the browser'

export const port = 4000

export const handler = () => {

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
    .get('/graph', (req, res) => depcruise()
      .then(modules => res.send({
        modules: modules |> map('source'),
        dependencies: modules
          |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => ({ source, target: resolved }))),
      }))
    )
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
  open(`http://localhost:${port}`)
}
