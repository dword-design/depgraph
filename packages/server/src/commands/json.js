import depcruise from '../depcruise'

export default {
  name: 'json',
  description: 'Output the dependency structure in JSON format',
  options: [
    { name: '-d, --duplicated', description: 'Duplicate modules' },
  ],
  handler: async ({ duplicated: isDuplicated }) =>
    console.log(JSON.stringify(await depcruise({ isDuplicated }), undefined, 2)),
}
