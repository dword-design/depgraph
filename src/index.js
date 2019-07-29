import { getFormatter } from './formatter'

export default formatterName => {

  const { handler } = getFormatter(formatterName)

  handler()
}
