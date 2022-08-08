<template>
<div>
  <router-view>
    <Login />
  </router-view>
</div>
</template>

<script>
import Login from "./views/Login.vue";
export default {
  name: "App",
  components: {
    Login,
  },
};
</script>

<style lang="scss">
 
  @import '../src/style.css';
</style>
