import depcruise from './depcruise'
import { flatMap, map, reduce, slice, find } from '@dword-design/functions'
import path from 'path'

export default () => depcruise()
  .then(modules => ({
    modules: modules |> map('source'),
    rootFolder: modules |> reduce((rootFolder, { source }) => {

      const mergeFolder = (folder, parts) => {
        if (parts.length == 0) {
          folder.modules = [...folder.modules ?? [], source]
        } else {
          const part = parts[0]
          let subfolder = (folder.folders ?? []) |> find({ name: part })
          if (subfolder === undefined) {
            subfolder = { name: part }
            folder.folders = [ ...folder.folders ?? [], subfolder ]
          }
          mergeFolder(subfolder, parts |> slice(1))
        }
      }

      let parts = path.dirname(source).split('/')
      if (parts.length == 1 && parts[0] === '.') {
        parts = []
      }

      mergeFolder(rootFolder, parts)

      return rootFolder
    }, {}),
    dependencies: modules
      |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => ({ source, target: resolved }))),
  }))
