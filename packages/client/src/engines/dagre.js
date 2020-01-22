import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { forIn, stubObject, flatMap, map } from '@dword-design/functions'
import { css } from 'linaria'
import axios from 'axios'
import dagreD3 from 'dagre-d3'
import { colorPrimary, scriptBackground } from '../variables'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default component({
  props: {
    isDuplicated: {},
  },
  data: () => ({
    modules: {},
    isLoading: false,
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
          'http://localhost:4000/graph',
          { params: { duplicated: isDuplicated } },
        )
        this.modules = data
        this.isLoading = false
      },
    },
    clientData: {
      handler({ modules }) {
        d3.select(this.$el).select('svg').remove()

        const g = new dagreD3.graphlib.Graph()
          .setGraph({ rankdir: 'RL' })
          .setDefaultEdgeLabel(stubObject)

        modules |> forIn(({ source, label }) => g.setNode(source, {
          label,
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

        modules
          |> flatMap(({ source, dependencies }) => dependencies
            |> map(dependency => ({ source, target: dependency })),
          )
          |> forIn(({ source, target }) => g.setEdge(source, target, { class: css`stroke: #000` }))

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
        }
      },
    },
  },
  render: ({ isLoading }) =>
    <div class={ css`height: 100%; position: relative; overflow: auto; padding: 1rem` }>
      <transition
        enter-active-class={ css`opacity: 0; transition: opacity .5s;` }
        enter-to-class={ css`opacity: 1` }
        leave-active-class={ css`opacity: 1; transition: opacity .5s` }
        leave-to-class={ css`opacity: 0` }
      >
        { isLoading && <div
          class={ css`
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255, .6);
          ` }
        /> }
      </transition>
      <PulseLoader
        class={ css`
          position: absolute;
          left: 50%;
          top: 30%;
          transform: translate(-50%, -50%);
        ` }
        color={ colorPrimary }
        loading={ isLoading }
      />
    </div>,
})
