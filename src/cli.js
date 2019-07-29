import program from 'commander'
import depgraph from '.'

program
  .option('-t, --format <formatterName>', 'The formatter to use')

program.parse(process.argv)

const formatterName = program.format

depgraph(formatterName)
