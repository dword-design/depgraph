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

export default {
  components: {
    Spinner,
  },
  computed: {
    primaryColor: () => variables.primaryColor,
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    finish() {
      this.loading = false
    },
    start() {
      this.loading = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'variables';

.container {
  z-index: 1;
  background: rgba(#fff, 0.5);
}

.spinner {
  position: absolute;
  top: 30%;
  left: 50%;
  flex-direction: row;
  transform: translate(-50%, -50%);
}
</style>
