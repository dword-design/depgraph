import execa from 'execa'
import { property, map, filter, reduce, flatMap, includes, uniq, find } from '@dword-design/functions'
import config from './config'
import multimatch from 'multimatch'
import getPackageName from 'get-package-name'
import P from 'path'

export default async ({ isDuplicated } = {}) => {

  let modules = execa(
    'depcruise',
    [
      '--do-not-follow', /(^|\\|\/)node_modules(\\|\/)/.source,
      '--output-type', 'json',
      'src',
    ],
    { all: true },
  )
    |> await
    |> property('all')
    |> JSON.parse
    |> property('modules')
    |> filter(({ source }) => multimatch(source, config.ignoreMatches).length === 0)
    |> map(module => ({
      source: module.source,
      label: module.coreModule
        ? module.source
        : module.matchesDoNotFollow
          ? getPackageName(module.source)
          : P.relative('src', module.source),
      isExternal: module.matchesDoNotFollow || module.coreModule,
      dependencies: module.dependencies,
    }))

  modules = modules |> map(module => ({
    ...module,
    dependencies: module.dependencies
      |> map(({ resolved }) => resolved)
      |> filter(target => multimatch(target, config.ignoreMatches).length === 0)
      |> map(target => ({
        target,
        isExternal: modules |> find({ source: target }) |> property('isExternal'),
      })),
  }))

  return isDuplicated
    ? (() => {
      const getContent = (currentModules, prefix = '') => currentModules
        |> reduce((duplicatedModules, module) => {
          return [
            ...duplicatedModules,
            {
              ...module,
              source: `${prefix}${module.source}`,
              dependencies: module.dependencies
                |> map(dependency => ({ ...dependency, target: `${prefix}${module.source}:${dependency.target}` })),
            },
            ...getContent(
              module.dependencies |> map(({ target }) => modules |> find({ source: target })),
              `${prefix}${module.source}:`,
            ),
          ]
        }, [])
      const targetNames = modules
        |> flatMap(({ dependencies }) => dependencies |> map('target'))
        |> uniq
      const sources = modules |> filter(({ source }) => !(targetNames |> includes(source)))
      return getContent(sources)
    })()
    : modules
}
