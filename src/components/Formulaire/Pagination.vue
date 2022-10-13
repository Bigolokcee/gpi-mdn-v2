<template>
  <div>
    <span v-for="i in nbrPages" :key="i"> {{ i }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      nbrPages: Number,
    },
    methods: {
      next() {},
    },
  };
</script>

<style scoped>
  div {
    text-align: center;
    width: 100%;
  }
  span {
    font-size: 30px;
    cursor: pointer;
  }
</style>
