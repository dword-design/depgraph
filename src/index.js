import { getFormatter } from './formatter'

export default ({ formatterName, isClusters }) => {

  const { handler } = getFormatter(formatterName)

  handler({ isClusters })
}
