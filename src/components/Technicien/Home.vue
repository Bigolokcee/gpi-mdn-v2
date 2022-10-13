<template>
  <div class="containerNavigation">
    <Header :user="user" :withSearchBar="true" />
    <Navigation :routes="routes" />
  </div>
</template>

<script>
  import { getCurrentSessionUser, sessionLogout } from '../../services/storage';
  import { redirectIfNotLogin } from '../../services/guard';
  import Header from '../Formulaire/Header.vue';
  import Navigation from '../General/Navigation.vue';

  export default {
    name: 'Navigation_Technicien',
    components: {
      Header,
      Navigation,
    },
    data() {
      return {
        user: getCurrentSessionUser(),
        routes: [
          {
            to: '/technicien/',
            name: 'SUIVI DE LA TACHE',
            iconeL: 'suivi.png',
          },
          {
            to: '/technicien/probleme',
            name: 'POSER UN PROBLEME',
            iconeL: 'problem.jpg',
          },
        ],
      };
    },
    methods: {
      logout() {
        if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) {
          sessionLogout();
          this.$router.push('/');
        }
      },
    },
    mounted() {
      redirectIfNotLogin(this.$router);
      Notification.requestPermission((status) => {
        console.log(status);
      });
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
      height: fit-content;
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .sideBar ul {
      display: flex !important;
      flex-direction: row !important;
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
</style>
