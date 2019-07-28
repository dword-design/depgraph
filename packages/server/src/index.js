import express from 'express'
import graphRoute from './routes/graph'
import path from 'path'

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
  .use(express.static(path.resolve(__dirname, '../../client/dist')))
  .use('/graph', graphRoute)

app.listen(port)
