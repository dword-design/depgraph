import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { map, flatMap } from '@dword-design/functions'
import variables from '../variables.config'
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const { edgeColor, edgeWidth, externalEdgeColor, externalEdgeWidth, nodeBorderColor, nodeBorderRadius, nodeVerticalPadding, nodeHorizontalPadding, nodeSpacing, externalNodeBackgroundColor, externalNodeBorderColor, nodeBackgroundColor, primaryColor } = variables
const vector = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
const neg = v => ({ x: -v.x, y: -v.y })

const drag = simulation => d3.drag()
  .on('start', d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  })
  .on('drag', d => {
    d.fx = d3.event.x
    d.fy = d3.event.y
  })
  .on('end', d => {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = undefined
    d.fy = undefined
  })

export default component({
  props: {
    layoutName: {},
    isDuplicated: {},
  },
  data: () => ({
    modules: {},
    simulation: undefined,
    isLoading: undefined,
  }),
  computed: {
    clientData() {
      return {
        modules: this.modules,
        layoutName: this.layoutName,
      }
    },
  },
  watch: {
    isDuplicated: {
      immediate: true,
      async handler(isDuplicated) {
        this.isLoading = true
        const { data } = await axios.get(
          'http://localhost:4000/modules',
          { params: { duplicated: isDuplicated } },
        )
        this.modules = data
        this.isLoading = false
      },
    },
    clientData: {
      handler({ modules }) {
        if (this.simulation !== undefined) {
          this.simulation.stop()
        }
        d3.select(this.$el).select('svg').remove()

        const nodes = modules |> map(module => ({
          ...module,
          id: module.source,
          name: /*this.isClusters ? path.basename(module) : */module.label,
        }))

        const links = modules
          |> flatMap(({ source, dependencies }) => dependencies
            |> map(dependency => ({ ...dependency, source })),
          )

        /*const groups = isClusters
          ? (() => {
            const groups = []
            const rec = (folder, parent) => {
              const group = {
                name: folder.name,
                leaves: folder.modules |> map(module => nodes |> findIndex({ fullName: module })),
              }
              if (parent !== undefined) {
                const index = groups.push(group) - 1
                parent.groups = [...parent.groups ?? [], index]
              }
              (folder.folders ?? []) |> forIn(subfolder => rec(subfolder, folder))
            }
            rec(rootFolder)
            return groups
          })()
          : []*/

        this.simulation = d3.forceSimulation()
          .nodes(nodes)
          .force('repulsive', d3.forceManyBody(-200))
          .force('collide', d3.forceCollide(70))
          .force('links', d3.forceLink(links).id(({ id }) => id))

        /*if (isClusters) {
          this.simulation.groups(groups)
        }*/

        const svg = d3
          .select(this.$el)
          .append('svg')
          .attr('class', 'Ov(v)')

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
          .attr('fill', edgeColor)

        /*const group = isClusters
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
          : undefined*/

        const node = svg
          .selectAll('.node')
          .data(nodes)
          .enter().append('rect')
          .attr('class', ({ isExternal }) => {
            const fill = isExternal ? externalNodeBackgroundColor : nodeBackgroundColor
            const stroke = isExternal ? externalNodeBorderColor : nodeBorderColor
            return `Cur(m) Fill(${fill}) Stk(${stroke})`
          })
          .attr('rx', nodeBorderRadius)
          .attr('ry', nodeBorderRadius)
          .call(drag(this.simulation))

        node
          .append('title')
          .text(({ name }) => name)

        const label = svg
          .selectAll('.label')
          .data(nodes)
          .enter().append('text')
          .attr('class', 'Fill(#000) Ff(sans) Fz(10px) Cur(m)')
          .attr('text-anchor', 'middle')
          .text(({ name }) => name)
          .call(drag(this.simulation))
          .each(function (d) {
            const b = this.getBBox()
            d.width = b.width + 2*nodeHorizontalPadding + 2*nodeSpacing
            d.height = b.height + 2*nodeVerticalPadding + 2*nodeSpacing
          })

        /*const groupLabel = isClusters
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
          : undefined*/

        const link = svg
          .selectAll('.link')
          .data(links)
          .enter().append('line')
          .attr('class', ({ isExternal }) => {
            const stroke = isExternal ? externalEdgeColor : edgeColor
            const strokeWidth = isExternal ? externalEdgeWidth : edgeWidth
            return `Stk(${stroke}) Stkw(${strokeWidth})`
          })
          .attr('marker-end', 'url(#end-arrow)')

        this.simulation.on('tick', () => {
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

          /*if (isClusters) {
            group
              .attr('x', ({ bounds }) => bounds.x)
              .attr('y', ({ bounds, labelHeight }) => bounds.y - labelHeight)
              // .each(({ bounds }) =>
              //   var cx = d.bounds.cx()
              //   // d.bounds.x = cx - 150
              //   // d.bounds.X = cx + 150
              // })
              .attr('width', ({ bounds }) => bounds.width() - groupSpacing)
              .attr('height', ({ bounds, labelHeight }) => bounds.height() - groupSpacing + labelHeight)

            groupLabel
              .attr('x', ({ bounds }) => bounds.x + bounds.width()/2)
              .attr('y', ({ bounds }) => bounds.y + rasterSize/2)
          }*/

          if (svg.node() !== null) {
            const { x, y, width, height } = svg.node().getBBox()
            svg
              .attr('width', width)
              .attr('height', height)
              .attr('viewBox', `${x} ${y} ${width} ${height}`)
          }
        })
      },
    },
  },
  beforeDestroy() {
    if (this.simulation !== undefined) {
      this.simulation.stop()
    }
  },
  render: ({ isLoading }) =>
    <div class="Pos(r) Ov(a) P(1rem)">
      <transition
        enter-active-class="Op(0) Trs(opacity .5s)"
        enter-to-class="Op(1)"
        leave-active-class="Op(1) Trs(opacity .5s)"
        leave-to-class="Op(0)"
      >
        { isLoading && <div class="StretchedBox Bg(rgba(#fff, .6))" /> }
      </transition>
      <PulseLoader
        class="Pos(a) Start(50%) T(30%) Translate(-50%, -50%)"
        color={ primaryColor }
        loading={ isLoading }
      />
    </div>,
})
