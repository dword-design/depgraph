import {
  filter,
  find,
  flatMap,
  includes,
  map,
  property,
  reduce,
  uniq,
} from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import getPackageName from 'get-package-name'
import multimatch from 'multimatch'
import P from 'path'

import config from './config'

const getLabel = module => {
  if (module.coreModule) {
    return module.source
  }
  if (module.matchesDoNotFollow) {
    return getPackageName(module.source)
  }
  return P.relative(process.cwd(), module.source)
}

export default async (options = {}) => {
  let modules =
    execa(
      packageName`dependency-cruiser`,
      [
        '--do-not-follow',
        /^node_modules/.source,
        '--exclude',
        /^(coverage|\.nyc_output|dist)/.source,
        '--output-type',
        'json',
        '.',
      ],
      { all: true }
    )
    |> await
    |> property('all')
    |> JSON.parse
    |> property('modules')
    |> filter(
      module => multimatch(module.source, config.ignoreMatches).length === 0
    )
    |> map(module => ({
      dependencies: module.dependencies,
      isExternal: module.matchesDoNotFollow || module.coreModule,
      label: module |> getLabel,
      source: module.source,
    }))
  modules =
    modules
    |> map(module => ({
      ...module,
      dependencies:
        module.dependencies
        |> map('resolved')
        |> filter(
          target => multimatch(target, config.ignoreMatches).length === 0
        )
        |> map(target => ({
          isExternal:
            modules |> find({ source: target }) |> property('isExternal'),
          target,
        })),
    }))
  return options.isDuplicated
    ? (() => {
        const getContent = (currentModules, prefix = '') =>
          currentModules
          |> reduce(
            (duplicatedModules, module) => [
              ...duplicatedModules,
              {
                ...module,
                dependencies:
                  module.dependencies
                  |> map(dependency => ({
                    ...dependency,
                    target: `${prefix}${module.source}:${dependency.target}`,
                  })),
                source: `${prefix}${module.source}`,
              },
              ...getContent(
                module.dependencies
                  |> map(
                    dependency => modules |> find({ source: dependency.target })
                  ),
                `${prefix}${module.source}:`
              ),
            ],
            []
          )
        const targetNames =
          modules
          |> flatMap(module => module.dependencies |> map('target'))
          |> uniq
        const sources =
          modules |> filter(module => !(targetNames |> includes(module.source)))
        return getContent(sources)
      })()
    : modules
}
