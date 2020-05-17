<template>
  <form :class="$style.container">
    <span :class="$style.title">Depgraph</span>
    <ui-select
      :class="$style.item"
      label="Engine"
      :value="engineName"
      @input="$router.push({ name: 'index.' + $event.target.value })"
    >
      <option v-for="name in engines" :key="name" :value="name">{{
        name
      }}</option>
    </ui-select>
    <ui-select
      :class="$style.item"
      label="Layout"
      :value="layoutName"
      @input="$router.push({ query: { layout: $event.target.value } })"
    >
      <option v-for="name in layoutNames" :key="name" :value="name">
        {{ name }}
      </option>
    </ui-select>
    <ui-checkbox
      :class="$style.item"
      :value="isDuplicated"
      @input="$router.push({ query: { duplicated: $event } })"
    >
      Duplicated
    </ui-checkbox>
    <ui-checkbox
      :class="$style.item"
      :value="isClusters"
      @input="$router.push({ query: { clusters: $event } })"
    >
      Clusters
    </ui-checkbox>
  </form>
</template>

<script>
import engines from '@/model/engines.config'
import layoutNames from '@/model/layout-names'
import UiCheckbox from './ui-checkbox.vue'

export default {
  components: {
    UiCheckbox,
  },
  props: {
    engineName: {},
    layoutName: {},
    isDuplicated: {},
    isClusters: {},
  },
  computed: {
    engines: () => engines,
    layoutNames: () => layoutNames,
  },
}
</script>

<style lang="scss" module>
@import 'variables';

.container {
  display: flex;
  align-items: center;
  color: #fff;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background: $primary-color;
  box-shadow: 0 0 0.5rem 0 rgba(#fff, 0.4);
}

.title {
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-right: 1px solid #fff;
  font-weight: bold;
}

.item {
  margin-right: 1rem;
}
</style>
