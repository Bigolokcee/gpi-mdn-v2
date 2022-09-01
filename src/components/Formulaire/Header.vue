<template>
  <div class="containerHeader">
    <nav class="logoSearch">
      <a href="">
        <img src="../../assets/MDN_2.png" height="80" alt="" />
      </a>
      <!-- div class="dsi">Direction des Sytèmes d'Information</div -->
      <!-- <div v-if="withSearchBar == true">
        <Search />
      </div> -->
    </nav>
    <span class="appTitle">Système de gestion informatisée du parc informatique et des pannes</span>
    <nav class="divIcone">
      <span class="dropbtn name" style="color: #fff">
        <i class="fas fa-user" style="color: #fff"></i>
        {{ user.prenom }} {{ user.nom }}</span
      >

      <!-- <span class="name" @click="hideMenu = !hideMenu"></span> -->
      <div class="dropdown">
        <i class="fas fa-caret-down" style="color: #fff"></i>
        <div class="dropdown-content">
          <div v-if="hideMenu" class="menu">
            <!-- <div>
                <span @click="showModalUpdatePassword(d)" class="name">
                  <i title="Modifier le mot de passe" class="fa fa-edit"></i>
                  Modifier mot de passe
                </span>
              </div> -->
            <div>
              <span @click="disconnect" class="name">
                <i title="Se Déconnecter" class="fas fa-sign-out-alt"> </i>
                Déconnexion
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import { getCurrentSessionUser, sessionLogout } from '../../services/storage';
  // import Search from "./Search.vue";
  export default {
    data() {
      return {
        userLogged: getCurrentSessionUser(),
        hideMenu: true,
      };
    },
    components: {
      // Search,
    },
    props: {
      user: {},
      withSearchBar: Boolean,
    },
    methods: {
      disconnect() {
        Swal.fire({
          title: 'Déconnexion',
          text: 'Etes-vous sur de vouloir vous deconnecter ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Annuler',
          confirmButtonText: 'Oui !',
        }).then((result) => {
          if (result.isConfirmed) {
            sessionLogout();
            this.$router.go(0);
          }
        });
        // if (Swal.fire("Deconnexion", "", "warning")) {

        // }
      },
      showMenu() {
        alert('show');
      },
    },
  };
</script>

<style scoped>
  .containerHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 30px;
    position: absolute;
    width: 100%;
    height: 70px;
    left: 0px;
    top: 0px;
    background: #085a03;
  }
  .appTitle{
    color:#fff;
    font-size: 20px;
    text-transform: uppercase;
    max-width: 600px;
  }
  img:hover {
    opacity: 0.7;
    transition: all 0.3s ease-in-out;
  } 
  .divIcone {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .divIcone i {
    width: 30px;
    height: 30px;
    border: 100%;
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  .divIcone i,
  span {
    color: black;
    font-size: 18px;
    padding: 8px;
    text-align: center;
  }
  .name {
    cursor: pointer;
  }
  .droptn {
    color: black;
    padding: 16px;
    font-size: 16px;
    border: none;
  }
  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    right: 0px;
    color: white;
    background-color: white;
    min-width: 260px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 200px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  /* .dropdown-content a:hover {background-color: #ddd;} */

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* .dsi {
  text-align: center;
  color: white;
  text-transform: uppercase;
  transform: translateX(15px);
} */

  /* .logoSearch {
  display: flex;
  justify-content: space-around;
  width: 65%;
  align-items: center;
} */

  /* nav a {
  width: 35%;
}
.logoSearch div {
  width: 50%;
} */
  /* .logoSearch div:only-child {
  width: 100%;
}
 */

  /* .divIcone i:hover {
  background-color: rgba(49, 126, 79, 0.8);
} */

  /* Change the background color of the dropdown button when the dropdown content is shown */
  /* .dropdown:hover .dropbtn {background-color: #3e8e41;} */
</style>
