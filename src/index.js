import express from 'express'
import graphRoute from './routes/graph'
import path from 'path'

export default () => {
  const port = 4000

  const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(path.resolve(__dirname, 'client')))
    .use('/graph', graphRoute)

  app.listen(port)
}
