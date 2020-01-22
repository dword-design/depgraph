import depcruise from './depcruise'
import { map, join, endent, flatMap } from '@dword-design/functions'

export default async ({ layoutName, isDuplicated } = {}) => {
  const modules = await depcruise({ isDuplicated })
  const nodes = modules
    |> map(({ source, label }) => `"${source}" [label="${label}"]`)
    |> join('\n')
  /*const clustersTemplate = ({ name = '', modules, folders }, parentPath = '') => {
    const fullPath = [parentPath, name] |> compact |> join('/')
    return name !== ''
      ? endent`
        subgraph "cluster_${fullPath}" {
          label="${name}"
          ${modulesTemplate(modules)}
          ${folders |> map(folder => clustersTemplate(folder, fullPath)) |> join('\n')}
        }
      `
      : endent`
        ${modulesTemplate(modules)}
        ${folders |> map(folder => clustersTemplate(folder, fullPath)) |> join('\n')}
      `
  }*/

  const edges = modules
    |> flatMap(({ source, dependencies }) =>
      dependencies |> map(target => `"${source}" -> "${target}"`)
    )
    |> join('\n')

  return endent`
    strict digraph G {
      ordering=out
      rankdir=RL
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
      ${layoutName === 'centered' ? 'layout=neato' : ''}

      ${/*isClusters ? clustersTemplate(rootFolder) : */nodes}
      ${edges}
    }
  `
}
