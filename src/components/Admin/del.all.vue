<template>
  <div>
    {{ currentRouteName }}
  </div>
</template>

<script>
  import { _SERVER_URL } from '../../services/environment';
  export default {
    data() {
      return {
        directions: [],
        fonctions: [],
        materiels: [],
        users: [],
        categories: [],
      };
    },
    methods: {
      async loadData() {
        var directions = await fetch(_SERVER_URL + 'directions').then((r) =>
          r.json()
        );
        var fonctions = await fetch(_SERVER_URL + 'fonctions').then((r) =>
          r.json()
        );
        var materiels = await fetch(_SERVER_URL + 'materiels').then((r) =>
          r.json()
        );
        var users = await fetch(_SERVER_URL + 'users').then((r) => r.json());
        var categories = await fetch(_SERVER_URL + 'categories').then((r) =>
          r.json()
        );

        this.categories = categories;
        this.fonctions = fonctions;
        this.materiels = materiels;
        this.users = users;
        this.directions = directions;
      },
    },
    computed: {
      currentRouteName() {
        //return this.$route.name;
        return this.$router.history.current.path;
      },
    },
  };
</script>

<style></style>
