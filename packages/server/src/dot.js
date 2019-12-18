import buildGraph from './build-graph'
import { map, join, compact, endent } from '@dword-design/functions'
import path from 'path'

const colors = {
  '.vue': { color: '#000', backgroundColor: '#41f083' },
}

export default ({ isClusters } = {}) => buildGraph()
  .then(({ modules, rootFolder, dependencies }) => {
    const moduleParams = name => {
      const { color, backgroundColor } = colors[path.extname(name)] ?? {}
      return `[label="${isClusters ? path.basename(name) : name}"${color !== undefined ? ` fontcolor="${color}"` : ''}${backgroundColor !== undefined ? ` fillcolor="${backgroundColor}"` : ''}]`
    }
    const modulesTemplate = (modules = []) => modules |> map(name => `"${name}" ${moduleParams(name)}`) |> join('\r\n')
    const clustersTemplate = ({ name = '', modules, folders }, parentPath = '') => {
      const fullPath = [parentPath, name] |> compact |> join('/')
      return name !== ''
        ? endent`
          subgraph cluster_${fullPath} {
            label="${name}"
            ${modulesTemplate(modules)}
            ${folders |> map(folder => clustersTemplate(folder, fullPath)) |> join('\r\n')}
          }
        `
        : endent`
          ${modulesTemplate(modules)}
          ${folders |> map(folder => clustersTemplate(folder, fullPath)) |> join('\r\n')}
        `
    }
    return endent`
      strict digraph G {
        ordering=out
        rankdir=LR
        splines=true
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

        ${isClusters ? clustersTemplate(rootFolder) : modulesTemplate(modules)}

        ${dependencies |> map(({ source, target }) => `"${source}" -> "${target}" [penwidth=2.0]`) |> join('\r\n')}
      }`
  })
