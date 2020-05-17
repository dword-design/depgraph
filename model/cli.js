#!/usr/bin/env node

import makeCli from 'make-cli'
import dot from './dot'
import depcruise from './depcruise'
import graph from './graph'

makeCli({
  commands: [
    {
      name: 'graph',
      description: 'Output the dependency graph in the browser',
      handler: () => graph(),
    },
    {
      name: 'dot',
      description: 'Generate a DOT file that can be processed by GraphViz',
      options: [
        { name: '-d, --duplicated', description: 'Duplicate modules' },
        {
          name: '-c, --clusters',
          description: 'Use the folder structure to generate clusters',
        },
        { name: '-l, --layout <layout>', description: 'The layout name' },
      ],
      handler: async ({
        duplicated: isDuplicated,
        clusters: isClusters,
        layout: layoutName,
      }) => console.log(await dot({ isDuplicated, isClusters, layoutName })),
    },
    {
      name: 'json',
      description: 'Output the dependency structure in JSON format',
      options: [{ name: '-d, --duplicated', description: 'Duplicate modules' }],
      handler: async ({ duplicated: isDuplicated }) => {
        console.log(
          JSON.stringify(await depcruise({ isDuplicated }), undefined, 2)
        )
      },
    },
  ],
  defaultCommandName: 'graph',
})
