const toDot = require('./to-dot')

module.exports = {
  // depcruiseOptions: {
  //   outputType: 'dot',
  // },
  handler: modules => console.log(toDot(modules)),
}
