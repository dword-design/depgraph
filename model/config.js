import { cosmiconfigSync } from 'cosmiconfig'
import requirePackageName from 'require-package-name'

import { name as packageName } from '@/package.json'

const name = packageName |> requirePackageName.base
const explorer = cosmiconfigSync(name)
const searchResult = explorer.search()

export default searchResult || {}
