import { findConfig, gitignore, aliases } from '@dword-design/base'
import { keys } from '@functions'
import pkgDir from 'pkg-dir'
import path from 'path'
import { spawn } from 'child-process-promise'

export default options => Promise.all([pkgDir(), findConfig()])
  .then(([workspacePath, { depgraphIgnores }]) => {

    const ignores = [...gitignore, ...aliases |> keys, ...depgraphIgnores ?? []]

    return spawn(
      'node',
      [path.resolve(__dirname, 'depcruise-sandbox.js')],
      {
        capture: ['stdout'],
        cwd: path.resolve(workspacePath, 'src'),
        env: {
          ...process.env,
          DEPCRUISE_SANDBOX_PARAMS: JSON.stringify({ exclude: `(${ignores.join('|')})`, ...options }),
        },
      },
    )
  })
  .then(({ stdout: result }) => JSON.parse(result).modules)
