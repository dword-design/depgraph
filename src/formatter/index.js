import * as springFormatter from './spring'
import * as flowFormatter from './flow'
import FormatterMissingError from './formatter-missing-error'

const formatters = {
  spring: springFormatter,
  flow: flowFormatter,
}

export default formatters

export const getFormatter = (name = 'spring') => {
  const formatter = formatters[name]
  if (formatter === undefined) {
    throw new FormatterMissingError(name)
  }
  return formatter
}
