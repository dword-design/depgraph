<script>
import axios from 'axios'
import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import * as cola from 'webcola'
import { map, filter, findIndex } from '@functions'
import path from 'path'
import { css } from '@dword-design/linaria'
import { rasterSize, nodeVerticalPadding, nodeHorizontalPadding, nodeSpacing, scriptBackground, componentBackground } from '@variables'

const vector = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
const neg = v => ({ x: -v.x, y: -v.y })

export default component({
  mounted() {
    axios.get('http://localhost:4000/graph')
      .then(({ data: { modules, dependencies } }) => {
        const nodes = modules |> map(module => ({ name: module }))
        const links = dependencies
          |> map(({ source, target }) => {
            const sourceIndex = nodes |> findIndex({ name: source })
            const targetIndex = nodes |> findIndex({ name: target })
            if (sourceIndex === -1) {
              console.log(`Module ${source} does not exist.`)
            }
            if (targetIndex === -1) {
              console.log(`Module ${target} does not exist.`)
            }
            if (sourceIndex !== -1 && targetIndex !== -1) {
              return { source: sourceIndex, target: targetIndex }
            }
          })
          |> filter(x => x !== undefined)

        const simulation = cola.d3adaptor(d3)
          .linkDistance(1000)
          .avoidOverlaps(true)
          .symmetricDiffLinkLengths(40)

        const svg = d3
          .select(this.$el)
          .append('svg')

        svg
          .append('svg:defs').append('svg:marker')
          .attr('id','end-arrow')
          .attr('viewBox','0 -5 10 10')
          .attr('refX',8)
          .attr('markerWidth',6)
          .attr('markerHeight',6)
          .attr('orient','auto')
          .append('svg:path')
          .attr('d','M0,-5L10,0L0,5L2,0')
          .attr('stroke-width','0px')
          .attr('fill','#999')

        simulation
          .nodes(nodes)
          .links(links)
          .start(100, 10, 1000)

        const node = svg
          .selectAll('.node')
          .data(nodes)
          .enter().append('rect')
          .attr('class', ({ name }) =>
            `${path.extname(name) === '.vue' ? 'node-component' : ''} `
            + css`
              cursor: move;
              stroke: #000;
              rx: ${rasterSize/4};
              ry: ${rasterSize/4};
              &:not(.node-component) {
                fill: ${scriptBackground};
              }
              &.node-component {
                fill: ${componentBackground};
              }
            `
          )
          .call(simulation.drag)

        node
          .append('title')
          .text(({ name }) => name)

        const label = svg
          .selectAll('.label')
          .data(nodes)
          .enter().append('text')
          .attr('class', 'label')
          .text(({ name }) => name)
          .call(simulation.drag)
          .each(function (d) {
            const b = this.getBBox()
            d.width = b.width + 2*nodeHorizontalPadding + 2*nodeSpacing
            d.height = b.height + 2*nodeVerticalPadding + 2*nodeSpacing
          })

        const link = svg
          .selectAll('.link')
          .data(links)
          .enter().append('line')
          .attr('class', 'link')

        simulation.on('tick', () => {

          link
            .each(function ({ source, target }) {

              const getNodeOffset = (node, direction) => {
                const width = source.width/2 - nodeSpacing
                const height = source.height/2 - nodeSpacing
                const consideringWidthX = Math.sign(direction.x) * width
                const consideringWidthY = direction.y * consideringWidthX/direction.x
                const consideringHeightY = Math.sign(direction.y) * height
                const consideringHeightX = direction.x * consideringHeightY/direction.y

                return {
                  x: (Math.abs(consideringWidthY) <= height ? consideringWidthX : consideringHeightX),
                  y: (Math.abs(consideringWidthY) <= height ? consideringWidthY : consideringHeightY),
                }
              }

              const direction = vector(source, target)

              const sourceOffset = getNodeOffset(source, direction)
              const targetOffset = getNodeOffset(target, neg(direction))
              const sourcePoint = add(source, sourceOffset)
              const targetPoint = add(target, targetOffset)

              d3.select(this)
                .attr('x1', sourcePoint.x - nodeSpacing)
                .attr('y1', sourcePoint.y - nodeSpacing)
                .attr('x2', targetPoint.x - nodeSpacing)
                .attr('y2', targetPoint.y - nodeSpacing)
            })

          node
            .attr('x', ({ x, width }) => x - width / 2)
            .attr('y', ({ y, height }) => y - height / 2)
            .attr('width', ({ width }) => width - 2*nodeSpacing)
            .attr('height', ({ height }) => height - 2*nodeSpacing)

          label
            .attr('x', ({ x }) => x - nodeSpacing)
            .attr('y', function ({ y }) {
              return y + this.getBBox().height/4 - nodeSpacing
            })

          const bbox = svg.node().getBBox()
          svg
            .attr('width', bbox.width)
            .attr('height', bbox.height)
            .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
        })
      })
  },
  render: (h, { empty = '' }) => <div class={ empty }></div>,
})
</script>
