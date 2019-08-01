import depcruise from './depcruise'
import endent from 'endent'
import { map, flatMap, join } from '@functions'
import path from 'path'

const colors = {
  '.vue': { color: '#000', backgroundColor: '#41f083' },
}

export default ({ isClusters } = {}) => isClusters
  ? depcruise({ outputType: 'dot' })
  : depcruise()
    .then(modules => modules |> map(module => ({ ...module, ...colors[path.extname(module.source)] })))
    .then(modules => endent`
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

        ${modules |> map(({ source, backgroundColor, color }) => `"${source}" [label="${source}"${color !== undefined ? ` fontcolor="${color}"` : ''}${backgroundColor !== undefined ? ` fillcolor="${backgroundColor}"` : ''}]`) |> join('\r\n')}

        ${modules |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => `"${source}" -> "${resolved}" [penwidth=2.0]`)) |> join('\r\n')}
      }`
    )
