import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { forIn, stubObject, flatMap, map } from '@dword-design/functions'
import dagreD3 from 'dagre-d3'
import variables from '../../variables.config'

const { nodeBorderRadius } = variables

export default component({
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

      this.modules |> forIn(({ source, label, isExternal }) => g.setNode(source, {
        label,
        height: 4,
        rx: nodeBorderRadius,
        ry: nodeBorderRadius,
        class: `${isExternal ? 'is-external ' : ''}Ff(Helvetica, sans-serif) Fz(12px)`,
      }))

      this.modules
        |> flatMap(({ source, dependencies }) => dependencies
          |> map(dependency => ({ ...dependency, source })),
        )
        |> forIn(({ source, target, isExternal }) => g.setEdge(
          source,
          target,
          {
            class: isExternal
              ? 'is-external Stk(externalEdgeColor) Stkw(externalEdgeWidth)'
              : 'Stk(edgeColor) Stkw(edgeWidth)',
          },
        ))

      const render = new dagreD3.render()
      const svg = d3
        .select(this.$el)
        .append('svg')
        .attr('class', 'Ov(v)')

      const inner = svg.append('g')

      render(inner, g)

      svg
        .selectAll('.node:not(.is-external) .label-container')
        .attr('class', 'Stk(nodeBorderColor) Fill(nodeBackgroundColor)')

      svg
        .selectAll('.node.is-external .label-container')
        .attr('class', 'Stk(externalNodeBorderColor) Fill(externalNodeBackgroundColor)')

      svg
        .selectAll('[id^=arrowhead] path')
        .attr('class', 'Stkw(0)!')

      svg
        .selectAll('.edgePath:not(.is-external) [id^=arrowhead] path')
        .attr('class', 'Fill(edgeColor)')

      svg
        .selectAll('.edgePath.is-external [id^=arrowhead] path')
        .attr('class', 'Fill(externalEdgeColor)')
      
      if (svg.node() !== null) {
        const { x, y, width, height } = svg.node().getBBox()
        svg
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `${x} ${y} ${width} ${height}`)
      }
    },
  },
  render: () => <div class="Pos(r) Ov(a) P(1rem)" />,
})
