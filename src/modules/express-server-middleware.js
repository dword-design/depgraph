import express from 'express'
import { reduce, mapValues, values } from '@dword-design/functions'

export default function () {
  let routes = this.options.expressServerMiddleware
  if (!Array.isArray(routes)) {
    routes = routes |> mapValues((handler, path) => ({ path, handler })) |> values
  }
  this.options.serverMiddleware.push({
    path: '/api',
    handler: routes |> reduce((api, { path, handler }) => api.get(path, handler), express()),
  })
}