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
import { split, last } from '@dword-design/functions'

export default {
  middleware: ({ route, redirect }) => {
    if (route.name === 'index') {
      return redirect({ name: 'index.dagre' })
    }
    return undefined
  },
  computed: {
    engineName() {
      return this.$route.name |> split('.') |> last
    },
    layoutName() {
      return this.$route.query.layout || 'directed'
    },
    isDuplicated() {
      return [true, 'true'].includes(this.$route.query.duplicated)
    },
    isClusters() {
      return [true, 'true'].includes(this.$route.query.clusters)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../model/variables.config';

.container {
  display: flex;
  height: 100%;
  flex-direction: column;
  background: #fafafa;
  font-family: $sans;
}

.toolbar {
  flex-shrink: 0;
  z-index: 1;
}

.child {
  height: 100%;
}
</style>
