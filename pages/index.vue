<template>
  <div class="container">
    <ui-toolbar
      class="toolbar"
      :engine-name="engineName"
      :layout-name="layoutName"
      :duplicated="isDuplicated"
      :clusters="isClusters"
      @layout-name-change="
        $router.push({ query: { ...$route.query, layout: $event } })
      "
      @is-duplicated-change="
        $router.push({ query: { ...$route.query, duplicated: $event } })
      "
      @is-clusters-change="
        $router.push({ query: { ...$route.query, clusters: $event } })
      "
    />
    <nuxt-child class="child" />
  </div>
</template>

<script>
import { last, split } from '@dword-design/functions'

export default {
  computed: {
    engineName() {
      return this.$route.name |> split('.') |> last
    },
    isClusters() {
      return [true, 'true'].includes(this.$route.query.clusters)
    },
    isDuplicated() {
      return [true, 'true'].includes(this.$route.query.duplicated)
    },
    layoutName() {
      return this.$route.query.layout || 'directed'
    },
  },
  middleware: context => {
    if (context.route.name === 'index') {
      return context.redirect({ name: 'index.dagre' })
    }
    return undefined
  },
}
</script>

<style lang="scss" scoped>
@import '../model/variables.config';

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafafa;
  font-family: $sans;
}

.toolbar {
  z-index: 1;
  flex-shrink: 0;
}

.child {
  height: 100%;
}
</style>
