<template>
  <div>
    <h3>{{ connexion }}</h3>
    <form>
      <div class="container" @submit="connectUser">
        <input
          v-model="email"
          type="text"
          name="email"
          tyep="email"
          placeholder="Email:"
        />
        <input v-model="pwd" type="password" name="pwd" />
      </div>
      <input type="submit" value="Envoyer" name="submit" />
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        pwd: '',
        errors: '',
      };
    },
    methods: {
      checkUserData(event) {
        event.preventDefault();
        console.log('Checking user data .....');
      },
      connectUser() {
        event.preventDefault();
        this.connectUser();
        console.log('Redirect User');
      },
    },
    props: {
      title: {
        title: String,
        message: 'Connexion',
      },
    },
  };
</script>

<style></style>
