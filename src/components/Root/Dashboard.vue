<template>
  <div class="containerNavigation">
    <Header :user="user" :withSearchBar="false" />
    <Navigation :routes="routes" />
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import { getCurrentSessionUser, sessionLogout } from '../../services/storage';
  import Header from '../Formulaire/Header.vue';
  import Navigation from '../General/Navigation.vue';

  export default {
    name: 'Navigation_Admin',
    components: {
      Header,
      Navigation,
    },
    data() {
      return {
        user: getCurrentSessionUser(),
        routes: [
          // { to: "/dashboard", name: "REQUETES", iconeL: "request.jpg",iconeAlt:""  },
          // { to: "/dashboard/tutelles", name: "TUTELLE",iconeL: "structure.png",iconeAlt:""},
          {
            to: '/dashboard',
            name: 'STRUCTURES',
            iconeL: 'structure.png',
            iconeAlt: '',
          },
          {
            to: '/dashboard/fonctions',
            name: 'FONCTIONS',
            iconeL: 'function.png',
            iconeAlt: '',
          },
          {
            to: '/dashboard/categories',
            name: 'CATEGORIE DE MATERIEL',
            iconeL: 'category.jpg',
            iconeAlt: '',
          },
          {
            to: '/dashboard/materiels',
            name: 'MATERIEL',
            iconeL: 'material.png',
            iconeAlt: '',
          },
          {
            to: '/dashboard/utilisateurs',
            name: 'UTILISATEUR',
            iconeL: 'users.png',
            iconeAlt: '',
          },
          {
            to: '/dashboard/problemes',
            name: 'POSER UN PROBLEME',
            iconeL: 'problem.jpg',
            iconeAlt: '',
          },
          // { to: "/dashboard/fournisseurs", name: "FOURNISSEUR",iconeL: "function.png",iconeAlt:""},
          // { to: "/dashboard/suiviTache", name: "SUIVI TACHE",iconeL: "",iconeAlt:""},
          // { to: "/dashboard/modeles", name: "MODELE",iconeL: "users.png",iconeAlt:""},

          {
            to: '/dashboard/recherche',
            name: 'SUPPRESSION',
            iconeL: 'trash.png',
          },
          // { to: "/dashboard/tache", name: "TACHE" },
          // { to: "/dashboard/statistique", name: "STATISTIQUE" },
        ],
      };
    },
    methods: {
      logout() {
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
            this.$router.push('/');
          }
        });
      },
      hi() {
        alert('hi');
      },
    },
  };
</script>

<style scoped>
  @media (max-width: 900px) {
    .test {
      display: flex;
      flex-direction: column;
    }

    .sideBar {
      border-top: solid 1px #fff;
      width: 100%;
      height: 110px;
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .sideBar ul {
      display: flex !important;
      /* flex-direction: row !important; */
      justify-content: space-between;
      align-items: center;
      width: 100vw;
    }

    li .routerLink {
      border: none;
      font-size: 0.85rem;
      text-align: center;
      min-width: 150px;
    }
  }
  .nameUser {
    font-size: 20px;
    color: #fff;
    width: 15%;
    text-align: center;
    line-height: 30px;
  }
</style>
