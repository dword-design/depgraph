import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { forIn, stubObject, indexOf } from '@dword-design/functions'
import { css } from 'linaria'
import axios from 'axios'
import dagreD3 from 'dagre-d3'
import { scriptBackground } from '../variables'

export default component({
  data: () => ({
    graph: {},
  }),
  computed: {
    allData() {
      return {
        graph: this.graph,
      }
    },
  },
  watch: {
    allData: {
      immediate: true,
      handler({ graph: { modules = [], dependencies = [] } }) {

        const g = new dagreD3.graphlib.Graph()
          .setGraph({ rankdir: 'RL' })
          .setDefaultEdgeLabel(stubObject)

        modules |> forIn((module, index) => g.setNode(index, {
          label: module,
          height: 4,
          class: css`
            .label-container {
              stroke: #000;
              rx: 8px;
              ry: 8px;
              fill: ${scriptBackground};
            }
            .label {
              font-family: Helvetica, sans-serif;
              font-size: 12px;
            }
          `,
        }))

        dependencies |> forIn(({ source, target }) => g.setEdge(
          modules |> indexOf(source),
          modules |> indexOf(target),
          { class: css`stroke: #000` },
        ))

        const render = new dagreD3.render()
        const svg = d3
          .select(this.$el)
          .append('svg')
        const inner = svg.append('g')

        render(inner, g)

        if (svg.node() !== null) {
          const { x, y, width, height } = svg.node().getBBox()
          svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `${x - 1} ${y - 1} ${width + 2} ${height + 2}`)
          /*const xCenterOffset = (svg.attr('width') - g.graph().width) / 2
          inner.attr('transform', `translate(${xCenterOffset}, 20)`)
          svg.attr('height', g.graph().height + 40)*/
        }
      },
    },
  },
  async mounted() {
    const { data } = await axios.get('http://localhost:4000/graph')
    this.graph = data
  },
  render: () => <div class={ css`display: block; padding: 1rem; overflow: auto` }></div>,
})
