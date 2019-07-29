import { cruise } from 'dependency-cruiser'
import { findConfig, gitignore, aliases } from '@dword-design/base'
import { keys } from '@functions'
import pkgDir from 'pkg-dir'
import path from 'path'

export default options => Promise.all([pkgDir(), findConfig()])
  .then(([workspacePath, { depgraphIgnores }]) => {

    const ignores = [...gitignore, ...aliases |> keys, ...depgraphIgnores]

    return cruise([path.resolve(workspacePath, 'src')], { exclude: `(${ignores.join('|')})`, ...options }).modules
  })
