import springFormatter from './spring'
import flowFormatter from './flow'
import jsonFormatter from './json'
import FormatterMissingError from './formatter-missing-error'

const formatters = {
  spring: springFormatter,
  flow: flowFormatter,
  json: jsonFormatter,
}

export default formatters

export const getFormatter = (name = 'spring') => {
  const formatter = formatters[name]
  if (formatter === undefined) {
    throw new FormatterMissingError(name)
  }
  return formatter
}
