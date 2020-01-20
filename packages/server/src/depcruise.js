import { spawn } from 'child-process-promise'
import { mapValues, property, map, pickBy, values, some, filter } from '@dword-design/functions'
import getWorkspaces from 'get-workspaces'
import config from './config'
import multimatch from 'multimatch'

export default async () => {
  const workspaces = await getWorkspaces()
  return (workspaces !== null && workspaces.length > 0
    ? workspaces
      |> map(({ name, config: { dependencies = {} } }) => ({
        source: name,
        dependencies: dependencies
          |> pickBy((version, name) => workspaces |> some({ name }))
          |> mapValues((version, name) => ({ resolved: name }))
          |> values,
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
  )
    |> filter(({ source }) => multimatch(source, config.ignoreMatches).length === 0)
    |> map(module => ({
      ...module,
      dependencies: module.dependencies
        |> filter(({ resolved }) => multimatch(resolved, config.ignoreMatches).length === 0),
    }))
}
