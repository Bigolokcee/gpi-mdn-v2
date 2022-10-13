<template>
  <div>
    <div>
      <Header :user="user" :withSearchBar="true" />
    </div>
    <div class="c-main">
      <div class="c-container">
        <div class="c-title">
          BIENVENU SUR LA PLATEFORME DE GESTION DU PARC INFORMATIQUE DU
          MINISTÈRE DE LA DÉFENSE NATIONALE
        </div>

        <div class="c-links">
          <div
            v-for="(item, index) in routes"
            class="c-link"
            @click="goto(item.url)"
            :key="index"
          >
            <component :is="item.icon" />
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCurrentSessionUser } from '../../services/storage';
  import Header from '../Formulaire/Header.vue';
  import SvgRequete from './svgs/SvgRequete.vue';
  import SvgStructure from './svgs/SvgStructure.vue';
  export default {
    components: { Header },

    data() {
      return {
        user: getCurrentSessionUser(),
        routes: [
          { icon: SvgRequete, title: 'Requetes', url: '/admin/' },
          { icon: SvgStructure, title: 'Structures', url: '/admin/directions' },
          { icon: SvgRequete, title: 'Fonctions', url: '/admin/fonctions' },
          {
            icon: SvgRequete,
            title: 'Catégorie de matériel',
            url: '/admin/categories',
          },
          { icon: SvgRequete, title: 'Matériel', url: '/admin/materiels' },
          {
            icon: SvgRequete,
            title: 'Utilisateurs',
            url: '/admin/utilisateurs',
          },
          {
            icon: SvgRequete,
            title: 'Fournisseurs',
            url: '/admin/fournisseurs',
          },
          {
            icon: SvgRequete,
            title: 'Suivie des tâches',
            url: '/admin/suiviTache',
          },
          { icon: SvgRequete, title: 'Patrimoine', url: '/admin/' },
          {
            icon: SvgRequete,
            title: 'Poser un problème',
            url: '/admin/problemes',
          },
        ],
      };
    },

    methods: {
      goto(route) {
        this.$router.push(route);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c-main {
    position: fixed;
    top: 70px;
    height: calc(100vh - 70px);
    left: 0;
    width: 100%;
    overflow: auto;
    background-color: #fff;
  }

  .c-container {
    width: 70%;
    margin: 4% auto;
  }

  .c-title {
    color: #000;
    font-weight: 700;
    font-size: 20px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: solid 2px #e5e5e5;
    padding: 0 16% 20px 16%;
  }

  .c-links {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 50px;
    margin-top: 60px;

    .c-link {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
