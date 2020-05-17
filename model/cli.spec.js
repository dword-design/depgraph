import withLocalTmpDir from 'with-local-tmp-dir'
import execa from 'execa'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default {
  dot: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        src: {
          'index.js': "import foo from './foo'",
          'foo.js': '',
        },
      })
      const { all } = await execa(require.resolve('./cli'), ['dot'], {
        all: true,
      })
      expect(all).toEqual(endent`
        strict digraph G {
          ordering=out
          rankdir=RL
          splines=true
          overlap=false
          nodesep=0.3
          ranksep=1
          fontname="Helvetica-bold"
          fontsize=9
          bgcolor="transparent"
          compound=true
          node [shape=box style="filled,rounded" color="#000000" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
          edge [color="#00000077" penwidth=2 arrowhead=normal fontname=Helvetica fontsize=9]
          "src/foo.js" [label="foo.js"]
          "src/index.js" [label="index.js"]
          "src/index.js" -> "src/foo.js"
        }
      `)
    }),
  json: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        src: {
          'index.js': "import foo from './foo'",
          'foo.js': '',
        },
      })
      const { all } = await execa(require.resolve('./cli'), ['json'], {
        all: true,
      })
      expect(all).toEqual(endent`
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
    }),
}
