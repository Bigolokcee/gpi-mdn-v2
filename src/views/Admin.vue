<template>
  <div class="Nav">
    <div class="container">
      <div class="containerNav">
        <div>
          <Navigation />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../components/Admin/Navigation.vue";
import { redirectIfNotLogin } from '../services/guard';

export default {
  name: "Admin",
  components: {
    Navigation,
  },
  mounted() {
    redirectIfNotLogin(this.$router);
    Notification.requestPermission(status => {
      console.log(status);
    });
  }
  
}
</script>

<style lang="scss" scoped>

</style>
