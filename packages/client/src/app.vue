<script>
import component from '@dword-design/vue-component'
import Toolbar from './toolbar.vue'
import Static from './static.vue'
import Simulation from './simulation.vue'
import { css } from 'linaria'

export default component({
  data: () => ({
    modules: [],
    dependencies: [],
    config: { default: {} },
  }),
  render(h, { empty = '' }) {
    const MainComponent = this.config.isSimulation ? Simulation : Static
    return <div
      class={ css`
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #fafafa;
        font-family: Verdana, sans-serif
      ` + empty }
    >
      <Toolbar
        class={ css`flex-shrink: 0; z-index: 1` }
        config={ this.config }
        on-change={ config => this.config = config }
      />
      <MainComponent
        class={ css`height: 100%` }
        is-flow-layout={ this.config.isFlowLayout }
        is-clusters={ this.config.isClusters }
      />
    </div>
  },
})
</script>
