<template>
  <div class="container" v-html="svgCode" />
</template>

<script>
export default {
  watchQuery: true,
  asyncData: async ({ query, app: { $axios } }) => {
    const svgCode = await $axios.$get('/api/dot', { params: query })
    return {
      svgCode,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  overflow: auto;
}
</style>
