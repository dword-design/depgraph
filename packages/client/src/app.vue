<script>
import component from '@dword-design/vue-component'
import Toolbar from './toolbar.vue'
import { css } from 'linaria'
import engines from './engines'

export default component({
  data: () => ({
    modules: [],
    dependencies: [],
    engineName: undefined,
    layoutName: undefined,
    isDuplicated: false,
    isClusters: false,
  }),
  render({ engineName = 'dot', layoutName = 'directed', isDuplicated, isClusters }) {
    const Engine = engines[engineName]
    return <div
      class={ css`
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #fafafa;
        font-family: Verdana, sans-serif
      ` }
    >
      <Toolbar
        class={ css`flex-shrink: 0; z-index: 1` }
        engine-name={ engineName }
        layout-name={ layoutName }
        is-duplicated={ isDuplicated }
        is-clusters={ isClusters }
        on-engine-name-change={ engineName => this.engineName = engineName }
        on-layout-name-change={ layoutName => this.layoutName = layoutName }
        on-is-duplicated-change={ isDuplicated => this.isDuplicated = isDuplicated }
        on-is-clusters-change={ isClusters => this.isClusters = isClusters }
      />
      <Engine
        class={ css`height: 100%` }
        layout-name={ layoutName }
        is-duplicated={ isDuplicated }
        is-clusters={ isClusters }
      />
    </div>
  },
})
</script>
