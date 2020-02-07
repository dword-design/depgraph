import express from 'express'
import { reduce, mapValues, values } from '@dword-design/functions'

export default function () {
  let routes = this.options.expressServerMiddleware
  if (!Array.isArray(routes)) {
    routes = values(mapValues((handler, path) => ({ path, handler }))(routes))
  }
  this.options.serverMiddleware.push({
    path: '/api',
    handler: reduce((api, { path, handler }) => api.get(path, handler), express())(routes),
  })
}