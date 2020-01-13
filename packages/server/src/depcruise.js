import { spawn } from 'child-process-promise'
import { mapValues, property, map, pickBy, replace, values, some } from '@dword-design/functions'
import getWorkspaces from 'get-workspaces'

export default async () => {
  const workspaces = await getWorkspaces()
  if (workspaces !== null && workspaces.length > 0) {
    return workspaces
      |> map(({ name, config: { dependencies = {} } }) => ({
        source: name,
        dependencies: dependencies
          |> pickBy((version, name) => workspaces |> some({ name }))
          |> mapValues((version, name) => ({ resolved: name }))
          |> values,
      }))
  } else {
    const { stdout } = await spawn(
      'depcruise',
      [
        '--exclude', /(^|\\|\/)node_modules(\\|\/)/.source,
        '--include-only', /(^|\\|\/)(src|dist)(\\|\/)/.source,
        '--do-not-follow', /(^|\\|\/)dist(\\|\/)/.source,
        '--output-type', 'json',
        '.',
      ],
      { capture: ['stdout'] }
    )
    const cleanPath = path => path
      |> replace(/^packages(\\|\/)/, '')
      |> replace(/(^|\\|\/)(src|dist)(\\|\/)/, '$1')

    return stdout
      |> JSON.parse
      |> property('modules')
      |> pickBy(({ source }) => !/(^|\\|\/)dist(\\|\/)/.test(source))
      |> mapValues(module => ({
        ...module,
        source: module.source |> cleanPath,
        dependencies: module.dependencies
          |> map(dependency => ({
            ...dependency,
            resolved: dependency.resolved |> cleanPath,
          })),
      }))
  }
}
