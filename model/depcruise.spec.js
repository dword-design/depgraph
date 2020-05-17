import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import stealthyRequire from 'stealthy-require'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'index.js': "import foo from './foo'",
        'foo.js': '',
      })
      const depcruise = stealthyRequire(require.cache, () =>
        require('./depcruise')
      )

      expect(await depcruise()).toEqual([
        {
          source: 'foo.js',
          label: 'foo.js',
          dependencies: [],
        },
        {
          source: 'index.js',
          label: 'index.js',
          dependencies: [{ target: 'foo.js' }],
        },
      ])
    }),
}
