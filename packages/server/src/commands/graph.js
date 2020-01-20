import { spawn } from 'child-process-promise'
import dot from '../dot'
import express from 'express'
import buildGraph from '../build-graph'
import { endent, filter, every, reduce, map, join } from '@dword-design/functions'
import P from 'path'
import getModuleAttributes from '../get-module-attributes'

export default {
  name: 'graph',
  description: 'Output the dependency graph in the browser',
  handler: () => {
    const port = 4000
    const clientPath = P.resolve(
      require.resolve('@dword-design/depgraph-client/package.json') |> P.dirname,
      'dist'
    )
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
      .get('/dot', async (req, res) => {
        const dotCode = await dot({ layoutName: req.query.layout, isDuplicated: req.query.duplicated === 'true', isClusters: req.query.clusters === 'true' })
        const { stdout: svgCode } = await spawn('dot', ['-T', 'svg'], { capture: ['stdout'] })
          .progress(({ stdin }) => {
            stdin.write(dotCode)
            stdin.end()
          })
        res.setHeader('Content-Type', 'image/svg+xml')
        res.send(svgCode)
      })
      .get('/custom', async (req, res) => {
        const { modules, dependencies } = await buildGraph()
        const nodes = (() => {
          const sources = modules |> filter(module => dependencies |> every(({ target }) => target !== module))
          if (sources.length > 0) {
            const usedModules = []
            const getContent = (modules, layer = 0) => modules
              |> reduce((content, module, index) => {
                if (!usedModules.includes(module)) {
                  usedModules.push(module)
                  const targets = dependencies |> filter({ source: module }) |> map('target')
                  return endent`
                    ${content}
                    "${module}" ${getModuleAttributes(module, { pos: `${layer},${index - modules.length/2}` })}
                    ${getContent(targets, layer + 1)}
                  `
                }
                return content
              }, '')
            return getContent(sources)
          }
          return ''
        })()
        const dotCode = endent`
          strict digraph G {
            ordering=out
            rankdir=LR
            overlap=false
            nodesep=0.3
            ranksep=1
            fontname="Helvetica-bold"
            fontsize=9
            style="rounded,bold,filled"
            bgcolor="transparent"
            compound=true
            node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
            edge [color="#00000077" penwidth=2.0 arrowhead=normal fontname=Helvetica fontsize=9]
            layout=neato

            ${nodes}
            ${dependencies |> map(({ source, target }) => `"${source}" -> "${target}" [penwidth=2.0]`) |> join('\n')}
          }
        `
        const { stdout: svgCode } = await spawn('dot', ['-T', 'svg'], { capture: ['stdout'] })
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
