import { spawn } from 'child-process-promise'
import { property, map, pickBy, some, filter, keys, reduce, flatMap, includes, uniq, find } from '@dword-design/functions'
import getWorkspaces from 'get-workspaces'
import config from './config'
import multimatch from 'multimatch'

export default async ({ isDuplicated } = {}) => {
  const workspaces = await getWorkspaces()
  const modules = (workspaces !== null && workspaces.length > 0
    ? workspaces
      |> map(({ name, config: { dependencies = {} } }) => ({
        source: name,
        dependencies: dependencies
          |> pickBy((version, name) => workspaces |> some({ name }))
          |> keys,
      }))
    : spawn(
      'depcruise',
      [
        '--exclude', /(^|\\|\/)node_modules(\\|\/)/.source,
        '--output-type', 'json',
        'src',
      ],
      { capture: ['stdout'] },
    )
      |> await
      |> property('stdout')
      |> JSON.parse
      |> property('modules')
      |> map(module => ({
        ...module,
        dependencies: module.dependencies |> map('resolved'),
      }))
  )
    |> filter(({ source }) => multimatch(source, config.ignoreMatches).length === 0)
    |> map(module => ({
      ...module,
      dependencies: module.dependencies
        |> filter(dependency => multimatch(dependency, config.ignoreMatches).length === 0),
    }))

  return isDuplicated
    ? (() => {
      const getContent = (currentModules, prefix = '') => currentModules
        |> reduce((duplicatedModules, { source, dependencies }) => {
          return [
            ...duplicatedModules,
            {
              source: `${prefix}${source}`,
              label: source,
              dependencies: dependencies
                |> map(dependency => `${prefix}${source}:${dependency}`),
            },
            ...getContent(
              dependencies |> map(dependency => modules |> find({ source: dependency })),
              `${prefix}${source}:`,
            ),
          ]
        }, [])
      const targetNames = modules |> flatMap('dependencies') |> uniq
      const sources = modules |> filter(({ source }) => !(targetNames |> includes(source)))
      return getContent(sources)
    })()
    : modules |> map(module => ({ ...module, label: module.source }))
}
