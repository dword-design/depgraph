const graphviz = require('./graphviz')
const dot = require('./dot')
const json = require('./json')
const puml = require('./puml')
const colajs = require('./colajs')

const formatters = {
  graphviz,
  dot,
  json,
  puml,
  colajs,
}

exports.formatters = formatters

exports.getFormatter = formatterName => {
  const formatter = formatters[formatterName]
  if (formatter === undefined) {
    throw new Error(`A formatter with the name '${formatterName}' does not exist.`)
  }
  return formatter
}
