<template>
  <label>
    <span :class="$style.label">{{ label }}:</span>
    <select :class="$style.select" :value="value" v-on="$listeners">
      <slot />
    </select>
  </label>
</template>

<script>
export default {
  props: {
    label: {},
    value: {},
  },
}
</script>

<style lang="scss" module>
.select {
  border: 1px solid #fff;
  background: transparent;
}

.label {
  margin-right: 0.5rem;
}
</style>
