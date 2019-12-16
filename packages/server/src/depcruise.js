import { keys } from '@dword-design/functions'
import pkgDir from 'pkg-dir'
import path from 'path'
import { spawn } from 'child-process-promise'

export default options => pkgDir()
  .then(workspacePath => {

    const { depgraphIgnores } = getBaseConfig()
    const ignores = [...gitignore, ...getAliases() |> keys, ...depgraphIgnores ?? []]

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
