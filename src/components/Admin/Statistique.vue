<template>
  <div>
    <h1>Statistiques</h1>

    <div class="flex-container">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>10</div>
    </div>

    <!-- modification du mot de passe -->

    <!-- <div id="modifiyPassword" class="modal-vue"> -->
    <!-- <div class="overlay" v-if="modifiyPassword" @click="modifiyPassword = false"></div> -->

    <div>
      <!-- <form v-if="modifiyPassword" class="formModufyPassword"> -->
      <form action="" class="formModufyPassword">
        <!-- <button class="close" @click="modifiyPassword = false">x</button> -->
        <button class="close">x</button>
        <h1 class="h1">MODIFIER LE MOT DE PASSE</h1>
        <p>
          <label for="" style="float: left"
            >Entrer votre mot de passe actuel</label
          >
          <input type="password" class="passwordModifyInput" />
        </p>
        <p>
          <label for="" style="float: left"
            >Entrer le nouveau mot de passe</label
          >
          <input type="password" class="passwordModifyInput" />
        </p>
        <p>
          <label for="" style="float: left"
            >Confirmer le nouveau mot de passe</label
          >
          <input type="password" class="passwordModifyInput" />
        </p>

        <button class="button">Modifier le mot de passe</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { _SERVER_URL } from '../../services/environment';
  import { load } from '../../services/functions';
  export default {
    data() {
      return {
        totalCategorie: '',
        totalDirections: '',
        totalUsers: '',
        totalMateriels: '',
        totalFonctions: '',
      };
    },
    methods: {
      async getTotalCategories() {
        var ok = await load('fonctions');
        console.log(ok);

        var res = await fetch(_SERVER_URL + 'categories').then((r) => r.json());
        this.totalCategorie = res.data.length;
      },
      async getTotalDirections() {
        var res = await fetch(_SERVER_URL + 'directions').then((r) => r.json());
        this.totalDirections = res.data.length;
      },
      async getTotalUsers() {
        var res = await fetch(_SERVER_URL + 'users').then((r) => r.json());
        this.totalUsers = res.data.length;
      },
      async getTotalMateriels() {
        var res = await fetch(_SERVER_URL + 'materiels').then((r) => r.json());
        this.totalMateriels = res.data.length;
      },
      async getTotalFonctions() {
        var res = await fetch(_SERVER_URL + 'fonctions').then((r) => r.json());
        this.totalFonctions = res.data.length;
      },
    },
    mounted() {
      this.getTotalCategories();
      this.getTotalDirections();
      this.getTotalUsers();
      this.getTotalMateriels();
      this.getTotalFonctions();
    },
  };
</script>

<style scoped>
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 700px;
    width: 100%;
    background-color: DodgerBlue;
  }

  .flex-container div {
    background-color: #f1f1f1;
    width: 150px;
    margin: 10px;
    text-align: center;
    line-height: 75px;
    font-size: 30px;
  }

  /* css de modification de mot de passe */
  /* .h1
{
  font-size: 25px;
}
p
{
  margin: 15px;
}
.formModufyPassword
{
  width:40%;
  z-index: 9999;
  margin: auto;
  text-align: center;
  padding: 30px 40px;
  background-color: gainsboro; 
  border-radius: 5px;
  position: absolute;
  top:25%;
  left:35%;
} 
.passwordModifyInput
{
  width: 100%;
  border:2px solid #ccc;
  font-size: 10px;
  outline: none;
  padding: 1%;
  border-radius: 5px;
  font-size: 17px;
  margin:auto;
}
.button
{
  width: 40%;
  float: left;
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  transition:all 0.5s;
  margin-left: 3%;
}
.modal-vue .overlay 
{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}
.close
{
  position: absolute;
  top: 2%;
  right: 2%;
  float: right;
  width: 7%;
  color:white;
  background-color: red;
  opacity: 0.7;
  font-size: 20px;
  border: 1px solid red;
  border-radius: 100%;
}
.close:hover
{
  opacity: 1;
} */
</style>
