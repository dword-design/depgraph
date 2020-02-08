import withLocalTmpDir from 'with-local-tmp-dir'
import { spawn } from 'child-process-promise'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    src: {
      'index.js': 'import foo from \'./foo\'',
      'foo.js': '',
    },
  })
  const { stdout } = await spawn('depgraph', ['json'], { capture: ['stdout'] })
  expect(stdout).toEqual(endent`
    [
      {
        "source": "src/foo.js",
        "label": "foo.js",
        "dependencies": []
      },
      {
        "source": "src/index.js",
        "label": "index.js",
        "dependencies": [
          {
            "target": "src/foo.js"
          }
        ]
      }
    ]

  `)
})