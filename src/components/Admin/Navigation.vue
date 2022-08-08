<template>
  <div class="containerNavigation">
    <Header :user="user" :withSearchBar="false" />
    <Navigation :routes="routes"/>
  </div>
</template>

<script>
import { getCurrentSessionUser, sessionLogout } from "../../services/storage";
import Header from "../Formulaire/Header.vue";
import Navigation from "../General/Navigation.vue";

export default {
  name: "Navigation_Admin",
  components: {
    Header,
    Navigation,
  },
  data() {
    return {
      user: getCurrentSessionUser(),
      routes: [
        { to: "/admin", name: "REQUETES", iconeL: "request.jpg",iconeAlt:""  },
        { to: "/admin/directions", name: "STRUCTURES",iconeL: "structure.png",iconeAlt:"" },
        { to: "/admin/fonctions", name: "FONCTIONS",iconeL: "function.png",iconeAlt:"" },
        { to: "/admin/categories", name: "CATEGORIE DE MATERIEL",iconeL: "category.jpg",iconeAlt:"" },
        { to: "/admin/materiels", name: "MATERIEL",iconeL: "material.png",iconeAlt:"" },
        { to: "/admin/utilisateurs", name: "UTILISATEUR",iconeL: "users.png",iconeAlt:"" },
        { to: "/admin/problemes", name: "POSER UN PROBLEME",iconeL: "problem.jpg",iconeAlt:"" },
        // { to: "/admin/tutelles", name: "TUTELLE",iconeL: "structure.png",iconeAlt:""},
        { to: "/admin/fournisseurs", name: "FOURNISSEUR",iconeL: "fournisseur.png",iconeAlt:""},
        // { to: "/admin/modeles", name: "MODELE",iconeL: "users.png",iconeAlt:""},

        { to: "/admin/suiviTache", name: "SUIVI DE TACHE", iconeL: "task.png" },
        // { to: "/admin/recherche", name: "SUPPRESSION", iconeL: "trash.png" },
      // { to: "/admin/tache", name: "TACHE" },
        // { to: "/admin/statistique", name: "STATISTIQUE" },
]
    };
  },
  methods: {
    logout() {
      if (confirm("Etes-vous sur de vouloir vous deconnecter ?")) {
        sessionLogout();
        this.$router.push("/");
      }
    },
    hi() {
      alert("hi")
    }
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
