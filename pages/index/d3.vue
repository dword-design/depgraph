<template>
  <div :class="$style.container" />
</template>

<script>
import { flatMap, join, map } from '@dword-design/functions'
import * as d3 from 'd3'

import variables from '@/model/variables.config'

const vector = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })

const neg = v => ({ x: -v.x, y: -v.y })

const drag = simulation =>
  d3
    .drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on('drag', (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = undefined
      d.fy = undefined
    })

const getNodeOffset = (source, node, direction) => {
  const width = source.width / 2 - variables.nodeSpacing

  const height = source.height / 2 - variables.nodeSpacing

  const consideringWidthX = Math.sign(direction.x) * width

  const consideringWidthY = (direction.y * consideringWidthX) / direction.x

  const consideringHeightY = Math.sign(direction.y) * height

  const consideringHeightX = (direction.x * consideringHeightY) / direction.y

  return {
    x:
      Math.abs(consideringWidthY) <= height
        ? consideringWidthX
        : consideringHeightX,
    y:
      Math.abs(consideringWidthY) <= height
        ? consideringWidthY
        : consideringHeightY,
  }
}

export default {
  asyncData: async context => ({
    modules: await context.app.$axios.$get('/api/modules', {
      params: context.query,
    }),
  }),
  beforeDestroy() {
    if (this.simulation !== undefined) {
      this.simulation.stop()
    }
  },
  methods: {
    renderGraph() {
      if (this.simulation) {
        this.simulation.stop()
      }
      d3.select(this.$el).select('svg').remove()

      const nodes =
        this.modules
        |> map(module => ({
          ...module,
          id: module.source,
          // name: this.isClusters ? path.basename(module) : module.label,
          name: module.label,
        }))

      const links =
        this.modules
        |> flatMap(
          module =>
            module.dependencies
            |> map(dependency => ({ ...dependency, source: module.source }))
        )
      /* const groups = isClusters
        ? (() => {
          const groups = []
          const rec = (folder, parent) => {
            const group = {
              name: folder.name,
              leaves: folder.modules |> map(module => nodes |> findIndex({ fullName: module })),
            }
            if (parent !== undefined) {
              const index = groups.push(group) - 1
              parent.groups = [...parent.groups || [], index]
            }
            (folder.folders || []) |> forIn(subfolder => rec(subfolder, folder))
          }
          rec(rootFolder)
          return groups
        })()
        : [] */
      this.simulation = d3
        .forceSimulation()
        .nodes(nodes)
        .force('repulsive', d3.forceManyBody(-200))
        .force('collide', d3.forceCollide(70))
        .force(
          'links',
          d3.forceLink(links).id(link => link.id)
        )

      /* if (isClusters) {
        this.simulation.groups(groups)
      } */
      const svg = d3
        .select(this.$el)
        .append('svg')
        .attr('class', this.$style.svg)
      svg
        .append('svg:defs')
        .append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5L2,0')
        .attr('stroke-width', '0px')
        .attr('fill', variables.edgeColor)

      /* const group = isClusters
        ? svg
          .selectAll('.group')
          .data(groups)
          .enter().append('rect')
          .attr('class', css`
            stroke: #000;
            stroke-width: 2px;
            fill: transparent;
            cursor: move;
            rx: ${rasterSize/2};
            ry: ${rasterSize/2};
          `)
          .call(this.simulation.drag)
        : undefined */
      const $nodes = svg
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('rect')
        .attr(
          'class',
          node =>
            [
              this.$style.module,
              ...(node.isExternal ? [this.$style.isExternal] : []),
            ] |> join(' ')
        )
        .attr('rx', variables.nodeBorderRadius)
        .attr('ry', variables.nodeBorderRadius)
        .call(drag(this.simulation))
      $nodes.append('title').text(node => node.name)

      const $labels = svg
        .selectAll('.label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .text(node => node.name)
        .attr('class', this.$style.label)
        .call(drag(this.simulation))
        .each(function (d) {
          const b = this.getBBox()
          d.width =
            b.width +
            2 * variables.nodeHorizontalPadding +
            2 * variables.nodeSpacing
          d.height =
            b.height +
            2 * variables.nodeVerticalPadding +
            2 * variables.nodeSpacing
        })

      /* const groupLabel = isClusters
        ? svg
          .selectAll('.group-label')
          .data(groups)
          .enter().append('text')
          .attr('class', css`
            fill: #000;
            font-family: Verdana;
            font-size: 10px;
            text-anchor: middle;
            cursor: move;
          `)
          .text(({ name }) => name)
          .each(function (d) {
            const b = this.getBBox()
            d.minWidth = b.width
            d.labelHeight = b.height
          })
        : undefined */
      const $links = svg
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr(
          'class',
          link =>
            [
              this.$style.dependency,
              ...(link.isExternal ? [this.$style.isExternal] : []),
            ] |> join(' ')
        )
        .attr('marker-end', 'url(#end-arrow)')
      this.simulation.on('tick', () => {
        $links.each(function (link) {
          const direction = vector(link.source, link.target)

          const sourceOffset = getNodeOffset(
            link.source,
            link.source,
            direction
          )

          const targetOffset = getNodeOffset(
            link.source,
            link.target,
            neg(direction)
          )

          const sourcePoint = add(link.source, sourceOffset)

          const targetPoint = add(link.target, targetOffset)
          d3.select(this)
            .attr('x1', sourcePoint.x - variables.nodeSpacing)
            .attr('y1', sourcePoint.y - variables.nodeSpacing)
            .attr('x2', targetPoint.x - variables.nodeSpacing)
            .attr('y2', targetPoint.y - variables.nodeSpacing)
        })
        $nodes
          .attr('x', node => node.x - node.width / 2)
          .attr('y', node => node.y - node.height / 2)
          .attr('width', node => node.width - 2 * variables.nodeSpacing)
          .attr('height', node => node.height - 2 * variables.nodeSpacing)
        $labels
          .attr('x', label => label.x - variables.nodeSpacing)
          .attr('y', function (label) {
            return label.y + this.getBBox().height / 4 - variables.nodeSpacing
          })
        /* if (isClusters) {
          group
            .attr('x', group => group.bounds.x)
            .attr('y', group => group.bounds.y - group.labelHeight)
            // .each(({ bounds }) =>
            //   var cx = d.bounds.cx()
            //   // d.bounds.x = cx - 150
            //   // d.bounds.X = cx + 150
            // })
            .attr('width', group => group.bounds.width() - variables.groupSpacing)
            .attr('height', group => group.bounds.height() - variables.groupSpacing + group.labelHeight)

          groupLabel
            .attr('x', group => group.bounds.x + group.bounds.width()/2)
            .attr('y', group => group.bounds.y + variables.rasterSize/2)
        } */
        if (svg.node()) {
          const bbox = svg.node().getBBox()
          svg
            .attr('width', bbox.width)
            .attr('height', bbox.height)
            .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
        }
      })
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
  cursor: move;

  &:not(.is-external) {
    fill: $node-background-color;
    stroke: $node-border-color;
  }

  &.is-external {
    fill: $external-node-background-color;
    stroke: $external-node-border-color;
  }
}

.label {
  font-size: 10px;
  font-family: $sans;
  cursor: move;
  fill: #000;
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
</style>
