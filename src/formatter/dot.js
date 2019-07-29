import depcruise from './depcruise'

export default () => depcruise({ outputType: 'dot' }).then(dot => console.log(dot))
