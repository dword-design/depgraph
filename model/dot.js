import {
  compact,
  endent,
  flatMap,
  isEmpty,
  join,
  map,
  mapValues,
  values,
} from '@dword-design/functions'

import depcruise from './depcruise'
import variables from './variables.config'

export default async (options = {}) => {
  const modules = await depcruise({ isDuplicated: options.isDuplicated })
  const attributesToString = attributes =>
    attributes |> isEmpty
      ? ''
      : `[${
          attributes
          |> mapValues((value, key) => `${key}="${value}"`)
          |> values
          |> join(' ')
        }]`
  const nodes =
    modules
    |> map(
      module =>
        [
          `"${module.source}"`,
          attributesToString({
            label: module.label,
            ...(module.isExternal
              ? {
                  color: variables.externalNodeBorderColor,
                  fillcolor: variables.externalNodeBackgroundColor,
                }
              : {}),
          }),
        ]
        |> compact
        |> join(' ')
    )
    |> join('\n')
  /* const clustersTemplate = ({ name = '', modules, folders }, parentPath = '') => {
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
  } */
  const edges =
    modules
    |> flatMap(
      module =>
        module.dependencies
        |> map(
          dependency =>
            [
              `"${module.source}" -> "${dependency.target}"`,
              attributesToString({
                ...(dependency.isExternal
                  ? {
                      arrowhead: 'open',
                      arrowsize: 0.7,
                      color: variables.externalEdgeColor,
                      penwidth: variables.externalEdgeWidth,
                    }
                  : {}),
              }),
            ]
            |> compact
            |> join(' ')
        )
    )
    |> join('\n')
  const nodeStyle =
    ['filled', ...(variables.nodeBorderRadius > 0 ? ['rounded'] : [])]
    |> join(',')
  const rows = [
    'ordering=out',
    'rankdir=RL',
    'splines=true',
    'overlap=false',
    'nodesep=0.3',
    'ranksep=1',
    'fontname="Helvetica-bold"',
    'fontsize=9',
    'bgcolor="transparent"',
    'compound=true',
    `node [shape=box style="${nodeStyle}" color="${variables.nodeBorderColor}" fillcolor="${variables.nodeBackgroundColor}" height=0.2 fontname=Helvetica fontsize=9]`,
    `edge [color="${variables.edgeColor}" penwidth=${variables.edgeWidth} arrowhead=normal fontname=Helvetica fontsize=9]`,
    ...(options.layoutName === 'centered' ? ['layout=neato'] : []),
    /* isClusters ? clustersTemplate(rootFolder) : */
    nodes,
    edges,
  ]
  return endent`
    strict digraph G {
      ${rows |> compact |> join('\n')}
    }
  `
}
