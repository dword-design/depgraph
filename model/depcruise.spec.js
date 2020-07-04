import outputFiles from 'output-files'
import stealthyRequire from 'stealthy-require'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'foo.js': '',
        'index.js': "import foo from './foo'",
      })
      const depcruise = stealthyRequire(require.cache, () =>
        require('./depcruise')
      )
      expect(await depcruise()).toEqual([
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
      ])
    }),
}
