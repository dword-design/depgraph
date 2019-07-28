const { reduce, pull, find } = require('lodash')
const path = require('path')

module.exports = modules => reduce(
  modules,
  (rootCluster, module) => {
    const clusterNames = reduce(
      pull(path.dirname(module.source).split('/'), '.'),
      (clusterNames, part) => [...clusterNames, [...clusterNames, part].join('/')],
      [],
    )
    const cluster = reduce(
      clusterNames,
      (cluster, name) => {
        if (cluster.children === undefined) {
          cluster.children = []
        }
        var child = find(cluster.children || [], { name })
        if (child === undefined) {
          child = { name }
          cluster.children.push(child)
        }
        return child
      },
      rootCluster,
    )
    cluster.modules = [...cluster.modules || [], module]
    return rootCluster
  },
  {},
)
