<template>
   <div id="deleteDirection" class="modal-vue">

      <div class="overlay" v-if="deleteDirection" ></div>

      <form v-if="deleteDirection" @submit="handleSubmit" class="formDirection">
        <button class="close" @click="deleteDirection = false">x</button>
        <label for="">Voulez-vous vraiment supprimer cette direction ?</label>
        <div>
            <button @click="deleteCategorie" class="delete">Supprimer</button>
        </div> 
      </form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            deleteDirection: true
        }
    }
}
</script>

<style scoped>
.formDirection
  {
    width:40%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:35%;
    left:30%  
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
    top: 10px;
    right: 10px;
    width: 7%;
    height: 25px;
    color:white;
    background-color: red;
    font-size: 15px;
    border: 2px solid red;
  }
</style>