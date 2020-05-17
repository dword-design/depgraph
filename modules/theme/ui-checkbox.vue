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
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'

export default {
  props: {
    value: {},
  },
  data: () => ({
    editedValue: undefined,
  }),
  computed: {
    icon() {
      return this.editedValue ? faCheckSquare : faSquare
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.editedValue = value
      },
    },
    editedValue(editedValue) {
      this.$emit('input', editedValue)
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
