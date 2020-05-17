<template>
  <div :class="$style.container" />
</template>

<script>
import * as d3 from 'd3'
import { stubObject, flatMap, map, join } from '@dword-design/functions'
import dagreD3 from 'dagre-d3'
import variables from '@/model/variables.config'

const { nodeBorderRadius } = variables

export default {
  watchQuery: true,
  asyncData: async ({ query, app: { $axios } }) => ({
    modules: await $axios.$get('/api/modules', { params: query }),
  }),
  watch: {
    modules: {
      handler() {
        this.renderGraph()
      },
    },
  },
  mounted() {
    this.renderGraph()
  },
  methods: {
    renderGraph() {
      d3.select(this.$el).select('svg').remove()

      const g = new dagreD3.graphlib.Graph()
        .setGraph({ rankdir: 'RL' })
        .setDefaultEdgeLabel(stubObject)

      this.modules.forEach(({ source, label, isExternal }) =>
        g.setNode(source, {
          label,
          height: 4,
          rx: nodeBorderRadius,
          ry: nodeBorderRadius,
          class:
            [
              this.$style.module,
              ...(isExternal ? [this.$style.isExternal] : []),
            ] |> join(' '),
        })
      )

      const allDependencies =
        this.modules
        |> flatMap(
          ({ source, dependencies }) =>
            dependencies |> map(dependency => ({ ...dependency, source }))
        )

      allDependencies.forEach(({ source, target, isExternal }) =>
        g.setEdge(source, target, {
          class:
            [
              this.$style.dependency,
              ...(isExternal ? [this.$style.isExternal] : []),
            ] |> join(' '),
        })
      )

      const render = new dagreD3.render()
      const svg = d3
        .select(this.$el)
        .append('svg')
        .attr('class', this.$style.svg)

      render(svg.append('g'), g)

      svg
        .selectAll('.label-container')
        .attr('class', this.$style.labelContainer)

      if (svg.node()) {
        const { x, y, width, height } = svg.node().getBBox()
        svg
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `${x} ${y} ${width} ${height}`)
      }
    },
  },
}
</script>

<style lang="scss" module>
@import '../../model/variables.config.js';

.container {
  position: relative;
  overflow: auto;
  padding: 1rem;
}

.svg {
  overflow: visible;
}

.module {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
}

.label-container {
  .module:not(.is-external) & {
    stroke: $node-border-color;
    fill: $node-background-color;
  }

  .module.is-external & {
    stroke: $external-node-border-color;
    fill: $external-node-background-color;
  }
}

.dependency {
  &:not(.is-external) {
    stroke: $edge-color;
    stroke-width: $edge-width;
  }

  &.is-external {
    stroke: $external-edge-color;
    stroke-width: $external-edge-width;
  }
}

[id^='arrowhead'] path {
  stoke-width: 0 !important;

  .dependency:not(.is-external) & {
    fill: $edge-color;
  }

  .dependency.is-external & {
    fill: external-edge-color;
  }
}
</style>
