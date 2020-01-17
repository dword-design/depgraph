import buildGraph from './build-graph'
import { map, join, compact, endent, every, reduce, filter } from '@dword-design/functions'
import getModuleAttributes from './get-module-attributes'

export default async ({ layoutName, isDuplicated, isClusters } = {}) => {
  const { modules, rootFolder, dependencies } = await buildGraph()
  const content = isDuplicated
    ? (() => {
      const sources = modules |> filter(module => dependencies |> every(({ target }) => target !== module))
      if (sources.length > 0) {
        const getContent = (modules, prefix = '') => modules
          |> reduce((content, module) => {
            const targets = dependencies |> filter({ source: module }) |> map('target')
            return endent`
              ${content}
              "${prefix}${module}" ${getModuleAttributes(module, { isClusters })}
              ${targets |> map(target => `"${prefix}${module}" -> "${prefix}${module}:${target}"`) |> join('\n')}
              ${getContent(targets, `${prefix}${module}:`)}
            `
          }, '')
        return getContent(sources)
      }
      return ''
    })()
    : (() => {
      const modulesTemplate = (modules = []) => modules |> map(name => `"${name}" ${getModuleAttributes(name, { isClusters })}`) |> join('\n')
      const clustersTemplate = ({ name = '', modules, folders }, parentPath = '') => {
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
      }
      return endent`
        ${isClusters ? clustersTemplate(rootFolder) : modulesTemplate(modules)}

        ${dependencies |> map(({ source, target }) => `"${source}" -> "${target}"`) |> join('\n')}
      `
    })()

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

      ${content}
    }
  `
}
