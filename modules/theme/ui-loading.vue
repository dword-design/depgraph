<template>
  <transition name="fade">
    <div v-if="loading" class="container">
      <spinner class="spinner" :color="primaryColor" />
    </div>
  </transition>
</template>

<script>
import Spinner from 'vue-spinner/src/BeatLoader.vue'
import variables from './variables.json'

const { primaryColor } = variables

export default {
  components: {
    Spinner,
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    primaryColor,
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'variables';

.container {
  background: rgba(#fff, 0.5);
  z-index: 1;
}

.spinner {
  position: absolute;
  left: 50%;
  top: 30%;
  flex-direction: row;
  transform: translate(-50%, -50%);
}
</style>
