import { jsonToString } from '@dword-design/functions'
import pushPlugins from '@dword-design/nuxt-push-plugins'
import jsontosass from 'jsontosass'
import P from 'path'

export default function (moduleOptions) {
  const options = {
    ...this.options.theme,
    ...moduleOptions,
  }
  const optionsString = options |> jsonToString({ indent: 2 })
  this.addTemplate({
    fileName: P.join('theme', 'ui-checkbox.vue'),
    src: require.resolve('./ui-checkbox.vue'),
  })
  this.addTemplate({
    fileName: P.join('theme', 'ui-select.vue'),
    src: require.resolve('./ui-select.vue'),
  })
  this.addTemplate({
    fileName: P.join('theme', 'ui-loading.vue'),
    src: require.resolve('./ui-loading.vue'),
  })
  this.addTemplate({
    fileName: P.join('theme', 'ui-toolbar.vue'),
    src: require.resolve('./ui-toolbar.vue'),
  })
  this.addTemplate({
    fileName: P.join('theme', 'variables.scss'),
    options: optionsString |> jsontosass.convert,
    src: require.resolve('./output.template'),
  })
  this.addTemplate({
    fileName: P.join('theme', 'variables.json'),
    options: optionsString,
    src: require.resolve('./output.template'),
  })
  pushPlugins(this, {
    fileName: P.join('theme', 'plugin.js'),
    src: require.resolve('./plugin'),
  })
  this.options.css.push(require.resolve('./style.scss'))
  // this.options.loading = require.resolve('./ui-loading.vue')
}
