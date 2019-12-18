import dot from '../dot'

export default {
  name: 'dot',
  description: 'Generate a DOT file that can be processed by GraphViz',
  options: [
    { name: '-c, --clusters', description: 'Use the folder structure to generate clusters' },
  ],
  handler: async ({ clusters: isClusters } = {}) => {
    const dotText = await dot({ isClusters })
    console.log(dotText)
  },
}
