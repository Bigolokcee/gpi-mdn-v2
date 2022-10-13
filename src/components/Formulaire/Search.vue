<template>
  <div class="recherche">
    <i class="fa fa-search icon"></i>
    <input v-if="true" type="search" placeholder="Effectuer une Recherche" />
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      async searching() {
        //this.$emit('giveSearchValue', this.search)
        //this.$router.push('/admin/recherche');
      },
      showInputSearchF() {
        console.log(this.showInputSearchF);
        this.showInputSearch = !this.showInputSearch;
      },
    },
  };
</script>

<style scoped>
  .recherche {
    display: flex;
  }
  .recherche input {
    outline: none;
    border: 1px #ccc solid;
    border-radius: 0px 3px 3px 0px;
    width: 100%;
  }
  .icon {
    padding: 7px;
    background: rgb(44, 126, 63);
    border-radius: 3px 0px 0px 3px;
    color: white;
    min-width: 25px;
    text-align: center;
    transform: scale(1.2);
    cursor: pointer;
  }
</style>
