import springFormatter from './spring'
import staticSpringFormatter from './static-spring'
import flowFormatter from './flow'
import jsonFormatter from './json'
import dotFormatter from './dot'
import FormatterMissingError from './formatter-missing-error'

const formatters = {
  spring: springFormatter,
  'static-spring': staticSpringFormatter,
  flow: flowFormatter,
  json: jsonFormatter,
  dot: dotFormatter,
}

export default formatters

export const getFormatter = (name = 'spring') => {
  const formatter = formatters[name]
  if (formatter === undefined) {
    throw new FormatterMissingError(name)
  }
  return formatter
}
