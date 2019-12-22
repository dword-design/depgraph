import depcruise from '../depcruise'

export default {
  name: 'json',
  description: 'Output the dependency structure in JSON format',
  handler: async () => console.log(JSON.stringify(await depcruise(), undefined, 2)),
}
