import { mapValues } from '@dword-design/functions'
import outputFiles from 'output-files'
import stealthyRequire from 'stealthy-require'
import withLocalTmpDir from 'with-local-tmp-dir'

const runTest = config => () =>
  withLocalTmpDir(async () => {
    await outputFiles(config.files)

    const depcruise = stealthyRequire(require.cache, () =>
      require('./depcruise')
    )
    expect(await depcruise()).toEqual(config.result)
  })

export default {
  'inside dist': {
    files: {
      'dist/foo.js': '',
    },
    result: [],
  },
  'inside node_modules': {
    files: {
      'node_modules/foo/index.js': '',
    },
    result: [],
  },
  valid: {
    files: {
      'foo.js': '',
      'index.js': "import foo from './foo'",
    },
    result: [
      {
        dependencies: [],
        label: 'foo.js',
        source: 'foo.js',
      },
      {
        dependencies: [{ target: 'foo.js' }],
        label: 'index.js',
        source: 'index.js',
      },
    ],
  },
} |> mapValues(runTest)
