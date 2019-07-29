import dotFlat from '../dot-flat'

export const name = 'dot-flat'
export const handler = () => dotFlat().then(dot => console.log(dot))
