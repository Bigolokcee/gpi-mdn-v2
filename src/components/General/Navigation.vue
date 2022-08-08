<template>
  <div class="test">
    <div class="sideBar">
      <ul>
        <li @click="hi(route)" v-for="(route, i) in routes" :key="i">
          <router-link :to="route.to" class="routerLink">
            <!-- <img class = "icone" :src="route.icone" :alt="route.icone"> -->
            <div class="icone-link">
              <img
                class="icone"
                v-if="route.iconeL && route.iconeL.length > 0"
                :src="require(`../../assets/${route.iconeL}`)"
                alt="icone-requete"
              />
              <div class="link-container">
                {{ route.name }}
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import Swal from 'sweetalert2';
// import { sessionLogout } from "../../services/storage";
export default {
  data() {
    return {};
  },
  props: {
    routes: {},
  },
  methods: {
    logout() {
     /*  Swal.fire({
          title: 'Déconnexion',
          text: "Etes-vous sur de vouloir vous deconnecter ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: "Annuler",
          confirmButtonText: 'Oui !'
        }).then((result) => {
          if (result.isConfirmed) {
           sessionLogout();
           this.$router.go(0);
          }
      }) */
      
    },
    hi(route) {
      console.log("../../assets/" + route.iconeL);
      // this.$router.push(`/routerShow`);
    },
  },
  components: {},
};
</script>

<style scoped>
.icone-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 7px;
}
.icone {
  width: 30px;
  height: 30px;
}
ul {
  display: flex;
  flex-direction: row;
  justify-content: left;
  place-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-color: white;
  color: black;
  width: 100%;
  gap: 10px;
}
ul li {
  list-style-type: none;
  text-align: center;
}
li .routerLink {
  display: block;
  color: black;
  text-decoration: none;
  min-width: 120px;
  border: solid 1px transparent;
  border-radius: 4px;
  padding: 5px;
}

li .routerLink:hover,
li .router-link-exact-active {
  border: solid 1px midnightblue;
}
.test {
  position: fixed;
  left: 0;
  top: 96px;
  /* height: calc(100vh - 100px); */
  width: 100%;
  display: flex;
  flex-direction: column;
  /* display: grid;
  grid-template-columns: 200px calc(100% - 200px); */
}
.sideBar {
  background-color: white;
  width: 100%;
  overflow-x: auto;
  box-shadow: 0 4px 4px 0 #aaa;
  padding: 5px;
}
ul button {
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.main {
  height: 70vh;
  overflow: auto;
  width: 100%;
  padding: 1% 7%;
}
</style>
