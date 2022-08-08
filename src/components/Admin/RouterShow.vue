<template>
<div>
    <div>
        <Header :user="user" :withSearchBar="true" />
    </div>
   <div class="main">
       <h1>Show</h1>
      <router-view></router-view>
    </div>
</div>
</template>

<script>
import { getCurrentSessionUser } from '../../services/storage'
import Header from '../Formulaire/Header.vue'
export default {
  components: { Header },

data(){
    return {
        user: getCurrentSessionUser(),
    }
}
}
</script>

<style>

</style>