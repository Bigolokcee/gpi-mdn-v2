<template>
  <div v-if="data.length === 0" class="success emptyTache">
    <moon-loader
      style="display: inline-block"
      class="custom-class"
      color="#3b5998"
      :loading="loading"
      :size="100"
      sizeUnit="px"
    ></moon-loader>
  </div>
</template>

<script>
  import { MoonLoader } from '@saeris/vue-spinners';

  export default {
    components: {
      MoonLoader,
    },
    data() {
      return {
        loading: true,
        px: 60,
      };
    },
    props: ['data'],
    methods: {
      stopAnimate() {
        setTimeout(() => (this.loading = false), 1000);
      },
    },
    mounted() {
      this.stopAnimate();
    },
  };
</script>

<style></style>
