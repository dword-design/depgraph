import depcruise from './depcruise'
import { flatMap, map, reduce, slice, find } from '@functions'
import path from 'path'

export default () => depcruise()
  .then(modules => ({
    modules: modules |> map('source'),
    dependencies: modules
      |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => ({ source, target: resolved }))),
    groups: modules |> reduce((rootGroup, { source }) => {

      const mergeGroup = (group, parts) => {
        if (parts.length == 0) {
          group.modules = [...group.modules ?? [], source]
        } else {
          const part = parts[0]
          let subgroup = (group.groups ?? []) |> find({ name: part })
          if (subgroup === undefined) {
            subgroup = { name: part }
            group.groups = [ ...group.groups ?? [], subgroup ]
          }
          mergeGroup(subgroup, parts |> slice(1))
        }
      }

      let parts = path.dirname(source).split('/')
      if (parts.length == 1 && parts[0] === '.') {
        parts = []
      }
      mergeGroup(rootGroup, parts)

      return rootGroup
    }, {}),
  }))
