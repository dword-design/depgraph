import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'
import stealthyRequire from 'stealthy-require'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'package.json': endent`
      {
        "workspaces": ["packages/*"]
      }
    `,
    packages: {
      'a/package.json': endent`
        {
          "name": "a",
          "dependencies": {
            "b": "^1.0.0"
          }
        }
      `,
      'b/package.json': endent`
        {
          "name": "b"
        }
      `,
    },
  })
  const depcruise = stealthyRequire(require.cache, () => require('../../src/depcruise'))

  expect(await depcruise()).toEqual([
    {
      source: 'a',
      label: 'a',
      dependencies: [{ target: 'b' }],
    },
    {
      source: 'b',
      label: 'b',
      dependencies: [],
    },
  ])
})