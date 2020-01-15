<script>
import component from '@dword-design/vue-component'
import { css } from 'linaria'
import CheckBox from './checkbox.vue'
import { colorPrimary } from './variables'
import engines from './engines'
import { keys, map } from '@dword-design/functions'
import layoutNames from './layout-names'

export default component({
  props: {
    engineName: {},
    layoutName: {},
    isClusters: {},
  },
  render: ({ engineName, layoutName, isClusters, $listeners }) =>
    <form
      class={ css`
        display: flex;
        align-items: center;
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
      <label class={ css`margin-right: 1rem` }>
        <span class={ css`margin-right: .5rem` }>Engine:</span>
        <select
          class={ css`background: transparent; border: 1px solid #fff` }
          value={ engineName }
          on-input={ ({ target: { value } }) => $listeners['engine-name-change']?.(value) }
        >
          { engines |> keys |> map(name => <option value={ name }>{ name }</option>) }
        </select>
      </label>
      <label class={ css`margin-right: 1rem` }>
        <span class={ css`margin-right: .5rem` }>Layout:</span>
        <select
          class={ css`background: transparent; border: 1px solid #fff` }
          value={ layoutName }
          on-input={ ({ target: { value } }) => $listeners['layout-name-change']?.(value) }
        >
          { layoutNames |> map(name => <option value={ name }>{ name }</option>) }
        </select>
      </label>
      <CheckBox
        value={ isClusters }
        on-input={ value => $listeners['is-clusters-change']?.(value) }
      >
        Clusters
      </CheckBox>
    </form>,
})
</script>
