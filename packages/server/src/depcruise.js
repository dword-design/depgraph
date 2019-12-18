import pkgDir from 'pkg-dir'
import path from 'path'
import { spawn } from 'child-process-promise'

export default async options => {
  const workspacePath = await pkgDir()
  const { stdout } = spawn(
    'node',
    [path.resolve(__dirname, 'depcruise-sandbox.js')],
    {
      capture: ['stdout'],
      cwd: path.resolve(workspacePath, 'src'),
      env: {
        ...process.env,
        DEPCRUISE_SANDBOX_PARAMS: options,
      },
    },
  )
  return JSON.parse(stdout).modules
}
