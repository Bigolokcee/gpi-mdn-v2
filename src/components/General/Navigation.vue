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
                <span>{{ route.name }}</span>
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
.test {
  position: fixed;
  left: 0;
  top: 70px;
  /* height: calc(100vh - 100px); */
  display: flex;
  flex-direction: row;
  /* display: grid;
  grid-template-columns: 200px calc(100% - 200px); */
  width: 100%;
  height: 90vh;
}
.sideBar {
  background-color: white;
  width: 20%;
  overflow-x: auto;
  box-shadow: 0 4px 4px 0 #aaa;

}
.icone-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding:10px;
}
.icone {
  width: 25px;
  height: 25px;
}
ul {
  display: flex;
  flex-direction: column;
  justify-content: left;
  list-style-type: none;
  padding: 15px 0px 15px 15px;
  position: relative;
  right:0px;
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
  margin-bottom: 15px;
}
.link-container{
  margin-left:10px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.02em;
  color: #09101D;
}
li .routerLink:hover/* , li .router-link-exact-active */ {
  background-color:#e4eee3;
  border-right: 5px solid rgb(11, 35, 11);
  border-radius: none;
}
ul button {
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.main {
  width:80%;
}
</style>
