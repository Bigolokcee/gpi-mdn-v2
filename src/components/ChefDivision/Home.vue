<template>
  <div class="containerNavigation">
    <Header :user="user" :withSearchBar="true" />
    <Navigation :routes="routes" />
  </div>
</template>

<script>
import { redirectIfNotLogin } from "../../services/guard";
import { sessionLogout, getCurrentSessionUser } from "../../services/storage";
import Header from "../Formulaire/Header.vue";
import Navigation from "../General/Navigation.vue";

export default {
  name: "ChefDivision",
  components: {
    Header,
    Navigation,
  },
  data() {
    return {
      user: getCurrentSessionUser(),
      routes: [
        {
          to: "/chefDivision/",
          name: "ASSIGNER UNE TACHE",
          iconeL: "assign.png",
          iconeAlt: "",
        },
        {
          to: "/chefDivision/suivi",
          name: "SUIVI DE LA TACHE",
          iconeL: "suivi.png",
          iconeAlt: "",
        },
        {
          to: "/chefDivision/probleme",
          name: "POSER UN PROBLEME",
          iconeL: "problem.jpg",
          iconeAlt: "",
        },
      ],
    };
  },
  methods: {
    logout() {
      if (confirm("Etes-vous sur de vouloir vous deconnecter ?")) {
        sessionLogout();
        this.$router.push("/");
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

<style scoped></style>
