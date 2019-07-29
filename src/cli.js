import program from 'commander'
import depgraph from '.'
import formatters from './formatter'
import { map, join } from '@functions'
import endent from 'endent'

program
  .arguments('[formatter]')
  .description(endent`
    Renders a dependency graph or outputs dependency information via the CLI. Available formatters are:
      ${formatters |> map(({ name }) => `- ${name}`) |> join('\r\n')}
  `)
  .action(depgraph)

program.parse(process.argv)
