import * as springFormatter from './spring'
import * as springStaticFormatter from './spring-static'
import * as flowFormatter from './flow'
import * as jsonFormatter from './json'
import * as dotFormatter from './dot'
import * as dotFlatFormatter from './dot-flat'
import FormatterMissingError from './formatter-missing-error'
import { find } from '@functions'

const formatters = [
  springFormatter,
  springStaticFormatter,
  flowFormatter,
  jsonFormatter,
  dotFormatter,
  dotFlatFormatter,
]

export default formatters

export const getFormatter = (name = 'spring') => {
  const formatter = formatters |> find({ name })
  if (formatter === undefined) {
    throw new FormatterMissingError(name)
  }
  return formatter
}
