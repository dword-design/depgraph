import express from 'express'
import open from 'open'
import { noop } from '@functions'

export default (hook = noop) => {

  const port = 4000

  const app = express()
    .use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
      res.setHeader('Access-Control-Allow-Credentials', true)
      next()
    })
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  hook(app)

  app.listen(port)
  console.log(`Depgraph available at http://localhost:${port} …`)
  open(`http://localhost:${port}`)
}
