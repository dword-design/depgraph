import program from 'commander'
import depgraph from '.'

program
  .arguments('[formatter]')
  .action(depgraph)

program.parse(process.argv)
