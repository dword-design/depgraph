import express from 'express'
import path from 'path'
import { map, flatMap } from '@functions'
import depcruise from '../depcruise'
import server from './server'

export default () => server(app => app
  .use(express.static(path.resolve(__dirname, 'client')))
  .get('/graph', (req, res) => depcruise()
    .then(modules => res.send({
      modules: modules |> map('source'),
      dependencies: modules
        |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => ({ source, target: resolved }))),
    }))
  )
)
