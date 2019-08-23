<script>
import component from '@dword-design/vue-component'
import { css } from '@dword-design/linaria'
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { colorPrimary } from '@variables'

export default component({
  props: {
    isFlowLayout: {},
    isClusters: {},
  },
  data: () => ({
    svgCode: '',
    isLoading: false,
  }),
  computed: {
    allData() {
      return {
        isFlowLayout: this.isFlowLayout,
        isClusters: this.isClusters,
      }
    },
  },
  watch: {
    allData: {
      immediate: true,
      handler({ isFlowLayout, isClusters }) {
        this.isLoading = true
        axios.get(
          'http://localhost:4000/static',
          {
            params: { flow: isFlowLayout, clusters: isClusters },
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
    <div class={ css`height: 100%; position: relative` }>
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
      <div class={ css`height: 100%; overflow: auto` }>
        <div domPropsInnerHTML={ svgCode }></div>
      </div>
    </div>,
})
</script>
