#!/usr/bin/env node

import makeCli from 'make-cli'

import depcruise from './depcruise'
import dot from './dot'
import graph from './graph'

makeCli({
  commands: [
    {
      description: 'Output the dependency graph in the browser',
      handler: () => graph(),
      name: 'graph',
    },
    {
      description: 'Generate a DOT file that can be processed by GraphViz',
      handler: async options =>
        console.log(
          await dot({
            isClusters: options.clusters,
            isDuplicated: options.duplicated,
            layoutName: options.layout,
          })
        ),
      name: 'dot',
      options: [
        { description: 'Duplicate modules', name: '-d, --duplicated' },
        {
          description: 'Use the folder structure to generate clusters',
          name: '-c, --clusters',
        },
        { description: 'The layout name', name: '-l, --layout <layout>' },
      ],
    },
    {
      description: 'Output the dependency structure in JSON format',
      handler: async options => {
        console.log(
          JSON.stringify(
            await depcruise({ isDuplicated: options.duplicated }),
            undefined,
            2
          )
        )
      },
      name: 'json',
      options: [{ description: 'Duplicate modules', name: '-d, --duplicated' }],
    },
  ],
  defaultCommandName: 'graph',
})
