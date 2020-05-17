import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import stealthyRequire from 'stealthy-require'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        src: {
          'index.js': "import foo from './foo'",
          'foo.js': '',
        },
      })
      const depcruise = stealthyRequire(require.cache, () =>
        require('./depcruise')
      )

      expect(await depcruise()).toEqual([
        {
          source: 'src/foo.js',
          label: 'foo.js',
          dependencies: [],
        },
        {
          source: 'src/index.js',
          label: 'index.js',
          dependencies: [{ target: 'src/foo.js' }],
        },
      ])
    }),
}
