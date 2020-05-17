import pushPlugins from '@dword-design/nuxt-push-plugins'
import P from 'path'
import jsontosass from 'jsontosass'
import { jsonToString } from '@dword-design/functions'

export default function (moduleOptions) {
  const options = {
    ...this.options.theme,
    ...moduleOptions,
  }
  const optionsString = options |> jsonToString({ indent: 2 })

  this.addTemplate({
    src: require.resolve('./ui-checkbox.vue'),
    fileName: P.join('theme', 'ui-checkbox.vue'),
  })
  this.addTemplate({
    src: require.resolve('./ui-select.vue'),
    fileName: P.join('theme', 'ui-select.vue'),
  })
  this.addTemplate({
    src: require.resolve('./ui-loading.vue'),
    fileName: P.join('theme', 'ui-loading.vue'),
  })
  this.addTemplate({
    src: require.resolve('./ui-toolbar.vue'),
    fileName: P.join('theme', 'ui-toolbar.vue'),
  })
  this.addTemplate({
    src: require.resolve('./output.template'),
    fileName: P.join('theme', 'variables.scss'),
    options: optionsString |> jsontosass.convert,
  })
  this.addTemplate({
    src: require.resolve('./output.template'),
    fileName: P.join('theme', 'variables.json'),
    options: optionsString,
  })
  pushPlugins(this, {
    src: require.resolve('./plugin'),
    fileName: P.join('theme', 'plugin.js'),
  })
  this.options.css.push(require.resolve('./style.scss'))
  //this.options.loading = require.resolve('./ui-loading.vue')
}
