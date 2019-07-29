import dot from '../dot'

export const name = 'dot'
export const handler = () => dot().then(dot => console.log(dot))
