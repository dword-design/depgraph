import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { forIn, stubObject, flatMap, map } from '@dword-design/functions'
import axios from 'axios'
import dagreD3 from 'dagre-d3'
import variables from '../variables.config'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const { primaryColor, nodeBorderRadius } = variables

export default component({
  props: {
    layoutName: {},
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
          'http://localhost:4000/modules',
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
          style: {
            rx: nodeBorderRadius,
            ry: nodeBorderRadius,
          },
          /*class: `${isExternal ? 'is-external' : ''} `,
            + css`
              .label-container {
                rx: ${};
                ry: ${nodeBorderRadius};
              }
              .label {
                font-family: Helvetica, sans-serif;
                font-size: 12px;
              }
              &:not(.is-external) {
                .label-container {
                  stroke: ${nodeBorderColor};
                  fill: ${nodeBackgroundColor};
                }
              }
              &.is-external {
                .label-container {
                  stroke: ${externalNodeBorderColor};
                  fill: ${externalNodeBackgroundColor};
                }
              }
            `,*/
        }))

        modules
          |> flatMap(({ source, dependencies }) => dependencies
            |> map(dependency => ({ ...dependency, source })),
          )
          |> forIn(({ source, target }) => g.setEdge(
            source,
            target,
            {
              /*class: `${isExternal ? 'is-external' : ''} `
                + css`
                  [id^=arrowhead] path {
                    stroke-width: 0 !important;
                  }
                  &:not(.is-external) {
                    stroke: ${edgeColor};
                    stroke-width: ${edgeWidth};
                    [id^=arrowhead] path {
                      fill: ${edgeColor};
                    }
                  }
                  &.is-external {
                    stroke: ${externalEdgeColor};
                    stroke-width: ${externalEdgeWidth};
                    [id^=arrowhead] path {
                      fill: ${externalEdgeColor};
                    }
                  }
                `,*/
            },
          ))

        const render = new dagreD3.render()
        const svg = d3
          .select(this.$el)
          .append('svg')
          .attr('class', 'Ov(v)')
        const inner = svg.append('g')

        render(inner, g)

        if (svg.node() !== null) {
          const { x, y, width, height } = svg.node().getBBox()
          svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `${x} ${y} ${width} ${height}`)
        }
      },
    },
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
