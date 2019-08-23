import { cruise } from 'dependency-cruiser'

const params = JSON.parse(process.env.DEPCRUISE_SANDBOX_PARAMS)

console.log(JSON.stringify(cruise([process.cwd()], params)))
