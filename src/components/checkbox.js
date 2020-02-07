import component from '@dword-design/vue-component'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'

export default component({
  props: {
    value: {},
  },
  render: (h, { value, $scopedSlots, $listeners }) =>
    <label class="D(f) Ai(c)">
      <input
        class="Ap(n)"
        type="checkbox"
        value={ value }
        on-change={ ({ target }) => $listeners.input?.(target.checked) }
      />
      <font-awesome-icon
        class="Mend(.25rem)"
        icon={ value ? faCheckSquare : faSquare }
      />
      <span class="Cur(p)">{ $scopedSlots.default() }</span>
    </label>,
})
