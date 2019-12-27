#!/usr/bin/env node

import makeCli from 'make-cli'
import commands from '.'
import { mapValues, values } from '@dword-design/functions'

makeCli({
  commands: commands |> mapValues((command, name) => ({ name, ...command })) |> values,
  defaultCommandName: 'graph',
})
