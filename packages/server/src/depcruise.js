import { spawn } from 'child-process-promise'
import { mapValues, property, map, pickBy, replace } from '@dword-design/functions'

export default async () => {
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
