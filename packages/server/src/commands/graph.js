import { spawn } from 'child-process-promise'
import dot from '../dot'
import express from 'express'
import buildGraph from '../build-graph'
import { endent } from '@dword-design/functions'
import P from 'path'

const theDotCode = endent`
  strict digraph G {
    ordering=out
    rankdir=LR
    overlap=false
    splines=false
    nodesep=0.3
    ranksep=1
    fontname="Helvetica-bold"
    fontsize=9
    style="rounded,bold,filled"
    bgcolor="transparent"
    compound=true
    node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
    edge [color="#00000077" penwidth=2.0 arrowhead=normal fontname=Helvetica fontsize=9]

    "@dword-design/todo-client" [label="@dword-design/todo-client" pos="0,-1.5!"]

    "@dword-design/todo-authentication" [label="@dword-design/todo-authentication" pos="1,-8.5!"]

    "@dword-design/todo-assets" [label="@dword-design/todo-assets" pos="2,-3!"]

    "@dword-design/todo-flash-messages" [label="@dword-design/todo-flash-messages" pos="2,-2!"]

    "@dword-design/todo-variables" [label="@dword-design/todo-variables" pos="3,-0.5!"]

    "@dword-design/todo-pouchdb" [label="@dword-design/todo-pouchdb" pos="2,-1!"]

    "@dword-design/todo-router-link" [label="@dword-design/todo-router-link" pos="2,0!"]

    "@dword-design/todo-store" [label="@dword-design/todo-store" pos="3,-0.5!"]

    "@dword-design/todo-calendar-event" [label="@dword-design/todo-calendar-event" pos="1,-7.5!"]

    "@dword-design/todo-api" [label="@dword-design/todo-api" pos="2,-3.5!"]

    "@dword-design/todo-linked-account" [label="@dword-design/todo-linked-account" pos="2,-2.5!"]

    "@dword-design/todo-card" [label="@dword-design/todo-card" pos="3,-1!"]

    "@dword-design/todo-markdown" [label="@dword-design/todo-markdown" pos="2,-1.5!"]

    "@dword-design/todo-task-layout" [label="@dword-design/todo-task-layout" pos="2,0.5!"]

    "@dword-design/todo-title-bar-main" [label="@dword-design/todo-title-bar-main" pos="3,0!"]

    "@dword-design/todo-when" [label="@dword-design/todo-when" pos="2,2.5!"]

    "@dword-design/todo-date-opt-time" [label="@dword-design/todo-date-opt-time" pos="3,-2!"]

    "@dword-design/todo-time-input" [label="@dword-design/todo-time-input" pos="4,-0.5!"]

    "@dword-design/todo-recurrence" [label="@dword-design/todo-recurrence" pos="3,-1!"]

    "@dword-design/todo-database" [label="@dword-design/todo-database" pos="1,-6.5!"]

    "@dword-design/todo-dialog" [label="@dword-design/todo-dialog" pos="1,-5.5!"]

    "@dword-design/todo-entities" [label="@dword-design/todo-entities" pos="1,-4.5!"]

    "@dword-design/todo-types" [label="@dword-design/todo-types" pos="2,0.5!"]

    "@dword-design/todo-i18n" [label="@dword-design/todo-i18n" pos="1,-3.5!"]

    "@dword-design/todo-loading" [label="@dword-design/todo-loading" pos="1,-1.5!"]

    "@dword-design/todo-sidebar" [label="@dword-design/todo-sidebar" pos="1,0.5!"]

    "@dword-design/todo-draggable-list" [label="@dword-design/todo-draggable-list" pos="2,-2!"]

    "@dword-design/todo-task-view" [label="@dword-design/todo-task-view" pos="2,1!"]

    "@dword-design/todo-list-item" [label="@dword-design/todo-list-item" pos="3,-2!"]

    "@dword-design/todo-plannable" [label="@dword-design/todo-plannable" pos="3,-1!"]

    "@dword-design/todo-task" [label="@dword-design/todo-task" pos="4,0.5!"]

    "@dword-design/todo-styles" [label="@dword-design/todo-styles" pos="1,2.5!"]

    "@dword-design/todo-task-routes" [label="@dword-design/todo-task-routes" pos="1,4.5!"]

    "@dword-design/todo-color-input" [label="@dword-design/todo-color-input" pos="2,-6.5!"]

    "@dword-design/todo-flexible-button" [label="@dword-design/todo-flexible-button" pos="2,-3.5!"]

    "@dword-design/todo-image-input" [label="@dword-design/todo-image-input" pos="2,-2.5!"]

    "@dword-design/todo-when-state" [label="@dword-design/todo-when-state" pos="2,6.5!"]

    "@dword-design/todo-error" [label="@dword-design/todo-error" pos="0,-0.5!"]

    "@dword-design/todo-server" [label="@dword-design/todo-server" pos="0,0.5!"]

    "@dword-design/todo-authentication" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-authentication" -> "@dword-design/todo-flash-messages" [penwidth=2.0]
    "@dword-design/todo-authentication" -> "@dword-design/todo-pouchdb" [penwidth=2.0]
    "@dword-design/todo-authentication" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-authentication" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-authentication" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-api" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-linked-account" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-markdown" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-task-layout" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-calendar-event" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-card" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-authentication" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-calendar-event" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-database" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-dialog" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-entities" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-i18n" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-linked-account" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-loading" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-sidebar" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-styles" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-task-layout" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-task-routes" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-task-view" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-title-bar-main" [penwidth=2.0]
    "@dword-design/todo-client" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-color-input" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-color-input" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-database" -> "@dword-design/todo-pouchdb" [penwidth=2.0]
    "@dword-design/todo-database" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-date-opt-time" -> "@dword-design/todo-time-input" [penwidth=2.0]
    "@dword-design/todo-dialog" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-dialog" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-dialog" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-dialog" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-draggable-list" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-draggable-list" -> "@dword-design/todo-types" [penwidth=2.0]
    "@dword-design/todo-entities" -> "@dword-design/todo-database" [penwidth=2.0]
    "@dword-design/todo-entities" -> "@dword-design/todo-linked-account" [penwidth=2.0]
    "@dword-design/todo-entities" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-entities" -> "@dword-design/todo-types" [penwidth=2.0]
    "@dword-design/todo-entities" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-error" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-flash-messages" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-flexible-button" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-image-input" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-api" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-card" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-linked-account" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-list-item" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-loading" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-card" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-date-opt-time" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-task" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-plannable" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-router-link" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-draggable-list" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-task-view" [penwidth=2.0]
    "@dword-design/todo-sidebar" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-card" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-date-opt-time" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-task" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-task-layout" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-task-layout" -> "@dword-design/todo-title-bar-main" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-color-input" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-date-opt-time" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-draggable-list" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-flexible-button" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-image-input" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-linked-account" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-markdown" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-task" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-task-layout" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-task-routes" -> "@dword-design/todo-when-state" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-card" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-draggable-list" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-list-item" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-plannable" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-task" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-task-view" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-time-input" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-title-bar-main" -> "@dword-design/todo-assets" [penwidth=2.0]
    "@dword-design/todo-title-bar-main" -> "@dword-design/todo-router-link" [penwidth=2.0]
    "@dword-design/todo-title-bar-main" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-title-bar-main" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-types" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-types" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-types" -> "@dword-design/todo-when" [penwidth=2.0]
    "@dword-design/todo-when" -> "@dword-design/todo-date-opt-time" [penwidth=2.0]
    "@dword-design/todo-when" -> "@dword-design/todo-recurrence" [penwidth=2.0]
    "@dword-design/todo-when" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-when" -> "@dword-design/todo-variables" [penwidth=2.0]
    "@dword-design/todo-when-state" -> "@dword-design/todo-draggable-list" [penwidth=2.0]
    "@dword-design/todo-when-state" -> "@dword-design/todo-plannable" [penwidth=2.0]
    "@dword-design/todo-when-state" -> "@dword-design/todo-store" [penwidth=2.0]
    "@dword-design/todo-when-state" -> "@dword-design/todo-task" [penwidth=2.0]
    "@dword-design/todo-when-state" -> "@dword-design/todo-variables" [penwidth=2.0]
  }
`
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
        const dotCode = theDotCode
        /*const { modules, dependencies } = await buildGraph()
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
        `*/
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
