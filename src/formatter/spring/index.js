import express from 'express'
import graphRoute from './routes/graph'
import path from 'path'

export const prepareExpress = app => app
  .use(express.static(path.resolve(__dirname, 'client')))
  .use('/graph', graphRoute)
