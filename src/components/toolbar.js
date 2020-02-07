import component from '@dword-design/vue-component'
import CheckBox from './checkbox'
import engines from '../engines.config'
import { map } from '@dword-design/functions'
import layoutNames from '../layout-names'

export default component({
  props: {
    engineName: {},
    layoutName: {},
    isDuplicated: {},
    isClusters: {},
  },
  render: ({ engineName, layoutName, isDuplicated, isClusters, $listeners }) =>
    <form class="D(f) Ai(c) C(#fff) Py(.5rem) Bg(primaryColor) Bxsh(0 0 0.5rem 0 rgba(#fff, .4))">
      <span class="Px(1rem) Py(.5rem) Mend(1rem) Bdend(#fff) Fw(b)">Depgraph</span>
      <label class="Mend(1rem)">
        <span class="Mend(.5rem)">Engine:</span>
        <select
          class="Bg(t) Bd Bdc(#fff)"
          value={ engineName }
          on-input={ ({ target: { value } }) => $listeners['engine-name-change']?.(value) }
        >
          { engines |> map(name => <option value={ name }>{ name }</option>) }
        </select>
      </label>
      <label class="Mend(1rem)">
        <span class="Mend(.5rem)">Layout:</span>
        <select
          class="Bg(t) Bd Bdc(#fff)"
          value={ layoutName }
          on-input={ ({ target: { value } }) => $listeners['layout-name-change']?.(value) }
        >
          { layoutNames |> map(name => <option value={ name }>{ name }</option>) }
        </select>
      </label>
      <CheckBox
        class="Mend(1rem)"
        value={ isDuplicated }
        on-input={ value => $listeners['is-duplicated-change']?.(value) }
      >
        Duplicated
      </CheckBox>
      <CheckBox
        value={ isClusters }
        on-input={ value => $listeners['is-clusters-change']?.(value) }
      >
        Clusters
      </CheckBox>
    </form>,
})
