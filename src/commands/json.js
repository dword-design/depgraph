import depcruise from '../depcruise'

export const name = 'json'
export const description = 'Output the dependency structure in JSON format'
export const handler = () => depcruise().then(modules => console.log(JSON.stringify(modules, undefined, 2)))
