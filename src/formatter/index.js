import springFormatter from './spring'
import springStaticFormatter from './spring-static'
import flowFormatter from './flow'
import jsonFormatter from './json'
import dotFormatter from './dot'
import dotFlatFormatter from './dot-flat'
import FormatterMissingError from './formatter-missing-error'

const formatters = {
  spring: springFormatter,
  'spring-static': springStaticFormatter,
  flow: flowFormatter,
  json: jsonFormatter,
  dot: dotFormatter,
  'dot-flat': dotFlatFormatter,
}

export default formatters

export const getFormatter = (name = 'spring') => {
  const formatter = formatters[name]
  if (formatter === undefined) {
    throw new FormatterMissingError(name)
  }
  return formatter
}
