import dot from '../dot'

export const name = 'dot'
export const handler = ({ isClusters }) => dot({ isClusters }).then(dot => console.log(dot))
