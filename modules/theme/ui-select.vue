<template>
  <label>
    <span :class="$style.label">{{ label }}:</span>
    <select
      :class="$style.select"
      :value="value"
      v-on="$listeners"
    >
      <slot />
    </select>
  </label>
</template>

<script>
export default {
  props: {
    value: {},
    label: {},
  },
}
</script>

<style lang="scss" module>
.select {
  background: transparent;
  border: 1px solid #fff;
}

.label {
  margin-right: 0.5rem;
}
</style>
