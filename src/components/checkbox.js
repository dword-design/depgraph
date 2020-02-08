import component from '@dword-design/vue-component'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'

export default component({
  props: {
    value: {},
  },
  data: () => ({
    editedValue: undefined,
  }),
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.editedValue = value
      },
    },
    editedValue(editedValue) {
      this.$listeners.input?.(editedValue)
    },
  },
  render({ editedValue, $scopedSlots }) {
    return <label class="D(f) Ai(c)">
      <input
        class="Ap(n)"
        type="checkbox"
        checked={ editedValue }
        on-change={ ({ target: { checked } }) => this.editedValue = checked }
      />
      <span class="Cur(p)">
        <font-awesome-icon
          class="Mend(.25rem)"
          icon={ editedValue ? faCheckSquare : faSquare }
        />
        { $scopedSlots.default() }
      </span>
    </label>
  },
})
