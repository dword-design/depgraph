<script>
import component from '@dword-design/vue-component'
import { css } from '@dword-design/linaria'
import CheckBox from './checkbox.vue'
import { colorPrimary } from '@variables'

export default component({
  props: {
    config: {},
  },
  render: (h, { config, $listeners }) =>
    <form
      class={ css`
        display: flex;
        color: #fff;
        padding-top: .5rem;
        padding-bottom: .5rem;
        background: ${colorPrimary};
        box-shadow: 0 0 0.5rem 0 rgba(0,0,0,.4);
      ` }
    >
      <span
        class={ css`
          padding: .5rem 1rem;
          margin-right: 1rem;
          border-right: 1px solid #fff;
          font-weight: bold;
        ` }
      >
        Depgraph
      </span>
      <CheckBox
        class={ css`margin-right: 1rem` }
        value={ config.isSimulation }
        on-change={ isSimulation => $listeners.change?.({ ...config, isSimulation }) }
      >
        Simulation
      </CheckBox>
      <CheckBox
        class={ css`margin-right: 1rem` }
        value={ config.isFlowLayout }
        on-change={ isFlowLayout => $listeners.change?.({ ...config, isFlowLayout }) }
      >
        Flow Layout
      </CheckBox>
      <CheckBox
        value={ config.isClusters }
        on-change={ isClusters => $listeners.change?.({ ...config, isClusters }) }
      >
        Clusters
      </CheckBox>
    </form>,
})
</script>
