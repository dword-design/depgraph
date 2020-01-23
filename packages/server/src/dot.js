import depcruise from './depcruise'
import { map, join, endent, flatMap, mapValues, values, isEmpty } from '@dword-design/functions'
import { nodeBorderRadius, edgeColor, edgeWidth, externalEdgeColor, externalEdgeWidth, nodeBackgroundColor, nodeBorderColor, externalNodeBorderColor, externalNodeBackgroundColor } from '@dword-design/depgraph-variables'

export default async ({ layoutName, isDuplicated } = {}) => {
  const modules = await depcruise({ isDuplicated })
  const attributesToString = attributes => attributes |> isEmpty
    ? ''
    : '['
      + (attributes
        |> mapValues((value, key) => `${key}="${value}"`)
        |> values
        |> join(' ')
      )
    + ']'
  const nodes = modules
    |> map(({ source, label, isExternal }) => `"${source}" `
      + attributesToString({
        label,
        ...isExternal
          ? {
            color: externalNodeBorderColor,
            fillcolor: externalNodeBackgroundColor,
          }
          : {},
      })
    )
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
      dependencies |> map(({ target, isExternal }) =>
        `"${source}" -> "${target}" `
          + attributesToString({
            ...isExternal
              ? {
                color: externalEdgeColor,
                penwidth: externalEdgeWidth,
                arrowhead: 'open',
                arrowsize: .7,
              }
              : {},
          })
      )
    )
    |> join('\n')

  const nodeStyle = ['filled', ...nodeBorderRadius > 0 ? ['rounded'] : []] |> join(',')

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
      bgcolor="transparent"
      compound=true
      node [shape=box style="${nodeStyle}" color="${nodeBorderColor}" fillcolor="${nodeBackgroundColor}" height=0.2 fontname=Helvetica fontsize=9]
      edge [color="${edgeColor}" penwidth=${edgeWidth} arrowhead=normal fontname=Helvetica fontsize=9]
      ${layoutName === 'centered' ? 'layout=neato' : ''}

      ${/*isClusters ? clustersTemplate(rootFolder) : */nodes}
      ${edges}
    }
  `
}
