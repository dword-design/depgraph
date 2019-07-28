const { find } = require('lodash')

module.exports = {
  handler: modules => console.log(JSON.stringify({
    nodes: map(modules, ({ source }) => ({ name: path.basename(source) })),
    links: chain(modules)
      .flatMap(({ source, dependencies }) => map(dependencies, ({ resolved: target }) => ({ source, target })))
      .map(({ source, target }) => ({
        source: findIndex(modules, { source }),
        target: findIndex(modules, { source: target })
      }))
      .value(),
    groups: chain(modules)
      .reduce((groups, { source }, index) => {
        const modulePath = path.dirname(source)
        var groupIndex = findIndex(groups, { modulePath })
        if (groupIndex === -1) {
          groupIndex = groups.push({ name: path.basename(modulePath), modulePath }) - 1
        }
        const group = groups[groupIndex]
        group.leaves = [...group.leaves || [], index]

        const parentModulePath = path.join(modulePath, '..')
        var parentGroup = find(groups, { modulePath: parentModulePath })
        if (parentGroup !== undefined && !(parentGroup.groups || []).includes(groupIndex)) {
          parentGroup.groups = [...parentGroup.groups || [], groupIndex]
        }
        return groups
      }, [])
      .map(group => omit(group, 'modulePath'))
      .value(),
  }, undefined, 2)),
}
