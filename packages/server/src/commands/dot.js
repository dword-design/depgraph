import dot from '../dot'

export default {
  name: 'dot',
  description: 'Generate a DOT file that can be processed by GraphViz',
  options: [
    { name: '-d, --duplicated', description: 'Duplicate modules' },
    { name: '-c, --clusters', description: 'Use the folder structure to generate clusters' },
    { name: '-l, --layout <layout>', description: 'The layout name' },
  ],
  handler: async ({ duplicated: isDuplicated, clusters: isClusters, layout: layoutName } = {}) => {
    const dotText = await dot({ isDuplicated, isClusters, layoutName })
    console.log(dotText)
  },
}
