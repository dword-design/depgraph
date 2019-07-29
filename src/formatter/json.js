import depcruise from './depcruise'

export default () => depcruise().then(modules => console.log(JSON.stringify(modules, undefined, 2)))