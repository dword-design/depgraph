<template>
  <label :class="$style.container">
    <input
      :class="$style.input"
      type="checkbox"
      :checked="editedValue"
      @change="editedValue = $event.target.checked"
    />
    <span :class="$style.label">
      <font-awesome-icon :class="$style.icon" :icon="icon" />
      <slot />
    </span>
  </label>
</template>

<script>
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'

export default {
  computed: {
    icon() {
      return this.editedValue ? faCheckSquare : faSquare
    },
  },
  data: () => ({
    editedValue: undefined,
  }),
  props: {
    value: {},
  },
  watch: {
    editedValue(editedValue) {
      this.$emit('input', editedValue)
    },
    value: {
      handler(value) {
        this.editedValue = value
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
}

.input {
  appearance: none;
}

.icon {
  margin-right: 0.25rem;
}

.label {
  cursor: pointer;
}
</style>
