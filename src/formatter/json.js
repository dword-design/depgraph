import depcruise from '../depcruise'

export const name = 'json'
export const handler = () => depcruise().then(modules => console.log(JSON.stringify(modules, undefined, 2)))
