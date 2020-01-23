import component from '@dword-design/vue-component'
import * as d3 from 'd3'
import { forIn, stubObject, flatMap, map } from '@dword-design/functions'
import { css } from 'linaria'
import axios from 'axios'
import dagreD3 from 'dagre-d3'
import { edgeWidth, externalEdgeColor, externalEdgeWidth, nodeBorderColor, edgeColor, primaryColor, nodeBackgroundColor, externalNodeBackgroundColor, externalNodeBorderColor, nodeBorderRadius } from '@dword-design/depgraph-variables'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

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

        modules |> forIn(({ source, label, isExternal }) => g.setNode(source, {
          label,
          height: 4,
          class: `${isExternal ? 'is-external' : ''} `
            + css`
              .label-container {
                rx: ${nodeBorderRadius};
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
            `,
        }))

        modules
          |> flatMap(({ source, dependencies }) => dependencies
            |> map(dependency => ({ ...dependency, source })),
          )
          |> forIn(({ source, target, isExternal }) => g.setEdge(
            source,
            target,
            {
              class: `${isExternal ? 'is-external' : ''} `
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
                `,
            },
          ))

        const render = new dagreD3.render()
        const svg = d3
          .select(this.$el)
          .append('svg')
          .attr('class', css`overflow: visible`)
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
        color={ primaryColor }
        loading={ isLoading }
      />
    </div>,
})
