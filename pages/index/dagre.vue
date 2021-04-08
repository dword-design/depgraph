<template>
  <div :class="$style.container" />
</template>

<script>
import { flatMap, join, map, stubObject } from '@dword-design/functions'
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

import variables from '@/model/variables.config'

export default {
  asyncData: async context => ({
    modules: await context.app.$axios.$get('/api/modules', {
      params: context.query,
    }),
  }),
  methods: {
    renderGraph() {
      d3.select(this.$el).select('svg').remove()

      const g = new dagreD3.graphlib.Graph()
        .setGraph({ rankdir: 'RL' })
        .setDefaultEdgeLabel(stubObject)
      this.modules.forEach(module =>
        g.setNode(module.source, {
          class:
            [
              this.$style.module,
              ...(module.isExternal ? [this.$style.isExternal] : []),
            ] |> join(' '),
          height: 4,
          label: module.label,
          rx: variables.nodeBorderRadius,
          ry: variables.nodeBorderRadius,
        })
      )

      const allDependencies =
        this.modules
        |> flatMap(
          module =>
            module.dependencies
            |> map(dependency => ({ ...dependency, source: module.source }))
        )
      allDependencies.forEach(dependency =>
        g.setEdge(dependency.source, dependency.target, {
          class:
            [
              this.$style.dependency,
              ...(dependency.isExternal ? [this.$style.isExternal] : []),
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
        const bbox = svg.node().getBBox()
        svg
          .attr('width', bbox.width)
          .attr('height', bbox.height)
          .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      }
    },
  },
  mounted() {
    this.renderGraph()
  },
  watch: {
    modules: {
      handler() {
        this.renderGraph()
      },
    },
  },
  watchQuery: true,
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
  font-size: 12px;
  font-family: Helvetica, sans-serif;
}

.label-container {
  .module:not(.is-external) & {
    fill: $node-background-color;
    stroke: $node-border-color;
  }

  .module.is-external & {
    fill: $external-node-background-color;
    stroke: $external-node-border-color;
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
  stroke-width: 0 !important;

  .dependency:not(.is-external) & {
    fill: $edge-color;
  }

  .dependency.is-external & {
    fill: external-edge-color;
  }
}
</style>
