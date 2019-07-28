const clusterize = require('./clusterize')
const { flatMap, chain, reduce, chunk } = require('lodash')
const path = require('path')
const endent = require('endent')

const clusterTemplate = ({ name, modules, children }) => endent`
  subgraph "cluster_${name}" {
    label="${path.basename(name)}"
    ${
      chain(modules)
        .map(({ source }) => `"${source}" [label="${path.basename(source)}" fillcolor="#41f083" URL="${source}"]`)
        .join('\r\n')
        .value()
    }
    ${
      chain(children)
        .flatMap(clusterTemplate)
        .join('\r\n')
        .value()
    }
  }`

const template = ({ clusters, links }) => endent`
  strict digraph G {
    ordering=out
    rankdir=LR
    splines=true
    overlap=false
    nodesep=0.3
    ranksep=0.18
    fontname="Helvetica-bold"
    fontsize=9
    style="rounded,bold,filled"
    fillcolor="#ffffff"
    compound=true
    node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
    edge [color="#00000077" penwidth=2.0 arrowhead=normal fontname=Helvetica fontsize=9]

    ${ chain(clusters).map(clusterTemplate).join('\r\n').value() }

    ${ chain(links).map(({ source, target }) => `"${source}" -> "${target}"`).join('\r\n').value() }
  }`

module.exports = modules => {
  const rootCluster = clusterize(modules)
  // const getEntryModule = ({ modules = [] }) => modules[0]
  // const getExitModule = ({ modules = [] }) => modules[0]
  // const getClusterLinks = ({ children = [] }) => [
  //   ...chain(children)
  //     .dropRight()
  //     .map((source, index) => ({ source: getEntryModule(source).source, target: getExitModule(children[index + 1]).source }))
  //     .value(),
  //   ...flatMap(children, getClusterLinks),
  // ]
  return template({
    clusters: rootCluster.children || [],
    links: flatMap(modules, ({ source, dependencies }) => dependencies.map(({ resolved: target }) => ({ source, target }))),
      //...getClusterLinks(rootCluster),
    //],
  })
}
