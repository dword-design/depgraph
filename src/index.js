import { getFormatter } from './formatter'

export default formatterName => {

  const formatter = getFormatter(formatterName)

  formatter()
}
