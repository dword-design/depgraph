import express from 'express'
import open from 'open'
import { getFormatter } from './formatter'

export default formatterName => {

  const formatter = getFormatter(formatterName)

  const port = 4000

  const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  formatter.prepareExpress(app)

  app.listen(port)
  console.log(`Depgraph available at http://localhost:${port} …`)
  open(`http://localhost:${port}`)
}
