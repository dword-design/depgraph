const { find } = require('lodash')

module.exports = {
  handler: modules => {

    modules = modules.map(module => ({
      ...module,
      source: module.source.substr(4),
      dependencies: module.dependencies.map(dependency => ({
        ...dependency,
        resolved: dependency.resolved.substr(4),
      })),
    }))
    const pathToNamespaceName = _path => _path.replace(/\./g, '-').split('/').map(camelCase).join('.')

    const traverse = ({ name, files, children }, indent = 0) => [
      ...name !== undefined ? [`${repeat('  ', indent)}namespace ${name} {`] : [],
      ...map(files, file => `${repeat('  ', indent + 1)}Class ${pathToNamespaceName(file)}`),
      ...flatMap(children, child => traverse(child, indent + 1)),
      ...name !== undefined ? [`${repeat('  ', indent)}}`] : [],
    ]

    console.log(
      [
        '@startuml',
        ...traverse(
          reduce(
            modules,
            (rootNamespace, module) => {
              const parts = path.dirname(module.source).split('/')
              const namespace = reduce(
                parts,
                (namespace, part) => {
                  if (namespace.children === undefined) {
                    namespace.children = []
                  }
                  var child = find(namespace.children || [], { name: part })
                  if (child === undefined) {
                    child = { name: pathToNamespaceName(part) }
                    namespace.children.push(child)
                  }
                  return child
                },
                rootNamespace,
              )
              namespace.files = [...namespace.files || [], path.basename(module.source)]
              return rootNamespace
            },
            {},
          ),
        ),
        ...chain(modules)
          .flatMap(({ source, dependencies }) => dependencies.map(({ resolved: target }) => ({ source, target })))
          .map(({ source, target }) => `"${pathToNamespaceName(source)}" --> "${pathToNamespaceName(target)}"`)
          .value(),
        '@enduml',
      ]
        .join('\r\n')
    )
  },
}
