<script>
export default {
  asyncData: async context => {
    const svgCode = await context.app.$axios.$get('/api/dot', {
      params: context.query,
    })

    return {
      svgCode,
    }
  },
  render() {
    return <div class="container" domPropsInnerHTML={this.svgCode} />
  },
  watchQuery: true,
}
</script>

<style lang="scss" scoped>
.container {
  overflow: auto;
}
</style>
