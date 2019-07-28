const { spawn } = require('child-process-promise')
const path = require('path')

module.exports = {
  depcruiseOptions: {
    outputType: 'dot',
  },
  handler: (dotStructure, basePath) => Promise.resolve()
    .then(() => spawn('dot', ['-T', 'svg'], { capture: ['stdout'] })
      .progress(({ stdin }) => {
        stdin.write(dotStructure)
        stdin.end()
      })
    )
    .then(({ stdout: svgCode }) =>
      spawn(
        path.resolve(basePath, 'node_modules/.bin/open-cli'),
        ['--extension', 'html'],
      )
        .progress(({ stdin }) => {
          stdin.write(svgCode)
          stdin.end()
        })
    )
}
