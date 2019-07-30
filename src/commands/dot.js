import dot from '../dot'

export const name = 'dot'
export const description = 'Generate a DOT file that can be processed by GraphViz'
export const options = [
  { name: '-c, --cluster', description: 'Use the folder structure to generate clusters' },
]
export const handler = ({ cluster: isClusters }) => dot({ isClusters }).then(dot => console.log(dot))
