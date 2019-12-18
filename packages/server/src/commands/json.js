import depcruise from '../depcruise'

export default {
  name: 'json',
  description: 'Output the dependency structure in JSON format',
  handler: async () => {
    const modules = await depcruise()
    console.log(JSON.stringify(modules, undefined, 2))
  },
}
