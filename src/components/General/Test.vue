<template>
  <div>
    <div class="container-msg" v-if="isOpen">
      <span>Vous n'avez aucune opération en cours ...</span>
      <span class="closeButton" @click="isOpen = false">X</span>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        isOpen: true,
      };
    },
  };
</script>

<style>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  .container-msg {
    padding: 20px;
    width: 80%;
    margin: 0 auto;
    margin-top: 30px;
    border-radius: 5px;
    background-color: rgb(206, 208, 231);
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .closeButton {
    font-size: 25px;
    cursor: pointer;
  }
</style>
