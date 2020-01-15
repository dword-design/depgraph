<script>
import component from '@dword-design/vue-component'
import { css } from 'linaria'
import SquareIcon from '@fortawesome/fontawesome-free/svgs/regular/square.svg'
import CheckSquareIcon from '@fortawesome/fontawesome-free/svgs/regular/check-square.svg'

export default component({
  props: {
    value: {},
  },
  render: (h, { value, $scopedSlots, $listeners }) =>
    <label class={ css`display: flex; align-items: center` }>
      <input
        class={ css`margin-right: .5rem; appearance: none` }
        type="checkbox"
        value={ value }
        on-change={ ({ target }) => $listeners.input?.(target.checked) }
      />
      { (() => {
        const Icon = value ? CheckSquareIcon : SquareIcon
        return <Icon class={ 'icon ' + css`width: .75rem; margin-right: .5rem` } />
      })() }
      <span class={ css`cursor: pointer` }>{ $scopedSlots.default?.() }</span>
    </label>,
})
</script>
