import component from '@dword-design/vue-component'
import { css } from 'linaria'
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { primaryColor } from '@dword-design/depgraph-variables'

export default component({
  props: {
    layoutName: {},
    isDuplicated: {},
    isClusters: {},
  },
  data: () => ({
    svgCode: '',
    isLoading: false,
  }),
  computed: {
    allData() {
      return {
        layoutName: this.layoutName,
        isDuplicated: this.isDuplicated,
        isClusters: this.isClusters,
      }
    },
  },
  watch: {
    allData: {
      immediate: true,
      handler({ layoutName, isDuplicated, isClusters }) {
        this.isLoading = true
        axios.get(
          'http://localhost:4000/dot',
          {
            params: { layout: layoutName, duplicated: isDuplicated, clusters: isClusters },
          },
        )
          .then(({ data: svgCode }) => {
            this.svgCode = svgCode
            this.isLoading = false
          })
      },
    },
  },
  render: (h, { svgCode, isLoading }) =>
    <div class={ css`height: 100%; position: relative; overflow: auto` }>
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
      <div domPropsInnerHTML={ svgCode }></div>
    </div>,
})
