import withLocalTmpDir from 'with-local-tmp-dir'
import execa from 'execa'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default {
  dot: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'index.js': "import foo from './foo'",
        'foo.js': '',
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
          "foo.js" [label="foo.js"]
          "index.js" [label="index.js"]
          "index.js" -> "foo.js"
        }
      `)
    }),
  json: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'index.js': "import foo from './foo'",
        'foo.js': '',
      })
      const { all } = await execa(require.resolve('./cli'), ['json'], {
        all: true,
      })
      expect(all).toEqual(endent`
      [
        {
          "source": "foo.js",
          "label": "foo.js",
          "dependencies": []
        },
        {
          "source": "index.js",
          "label": "index.js",
          "dependencies": [
            {
              "target": "foo.js"
            }
          ]
        }
      ]
    `)
    }),
}
