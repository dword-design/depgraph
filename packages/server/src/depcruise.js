import { spawn } from 'child-process-promise'

export default async () => {
  // (^|\\|/)node_modules[\\/]
  const { stdout } = await spawn('depcruise', ['--exclude', /(^|\\|\/)node_modules[\\/]/.source, '--output-type', 'json', 'src'], { capture: ['stdout'] })
  return JSON.parse(stdout).modules
}