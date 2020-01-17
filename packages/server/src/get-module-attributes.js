import P from 'path'
import colors from './colors'

export default (name, { isClusters = false, pos } = {}) => {
  const { color, backgroundColor } = colors[name |> P.extname] ?? {}
  return `[label="${isClusters ? (name |> P.basename) : name}"${color !== undefined ? ` fontcolor="${color}"` : ''}${backgroundColor !== undefined ? ` fillcolor="${backgroundColor}"` : ''}${pos !== undefined ? ` pos="${pos}!"` : ''}]`
}
