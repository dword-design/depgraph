import express from 'express'
import open from 'open'
import { noop } from '@functions'

export default (hook = noop) => {

  const port = 4000

  const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  hook(app)

  app.listen(port)
  console.log(`Depgraph available at http://localhost:${port} …`)
  open(`http://localhost:${port}`)
}