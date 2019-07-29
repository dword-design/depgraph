import express from 'express'
import path from 'path'
import { cruise } from 'dependency-cruiser'
import { findConfig, gitignore, aliases } from '@dword-design/base'
import { keys, map, flatMap } from '@functions'

export const prepareExpress = app => app
  .use(express.static(path.resolve(__dirname, 'client')))
  .use('/graph', express.Router()
    .get('/', (req, res) => findConfig()
      .then(({ depgraphIgnores }) => {
        const ignores = [
          ...gitignore,
          ...aliases |> keys,
          ...depgraphIgnores,
        ]

        const modules = cruise([process.cwd()], { exclude: `(${ignores.join('|')})` }).modules

        return res.send({
          modules: modules |> map('source'),
          dependencies: modules
            |> flatMap(({ source, dependencies }) => dependencies |> map(({ resolved }) => ({ source, target: resolved }))),
        })
      })
    )
  )
