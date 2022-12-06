<template>
  <div class="">
    <div class="containerNavigation">
      <Header :user="user" :withSearchBar="false" />
      <Navigation :routes="routes" />
    </div>
  </div>
</template>

<script>
  import { getCurrentSessionUser } from '../../services/storage';
  import { redirectIfNotLogin } from '../../services/guard';
  import Header from '../Formulaire/Header.vue';
  import Swal from 'sweetalert2';
  import Navigation from '../General/Navigation.vue';
  import { displayMessage, load, post } from '../../services/functions';

  export default {
    //sender assignedTo comeFrom problem
    components: {
      Header,
      Navigation
    },
    data() {
      return {
        utilisateur: {
          sender: getCurrentSessionUser()._id,
          description: '',
          materiel: '',
          createdAt: '',
        },
        routes: [
          {
            to: '/utilisateur',
            name: 'POSER UN PROBLEME',
            iconeL: 'problem.jpg',
          },
          {
            to: '/utilisateur/patrimoine',
            name: 'Mon patrimoine',
            iconeL: 'material.png',
          },
        ],
        showForm: false,
        modifyPassword: false,
        user: getCurrentSessionUser(),
        responseText: false,
        description: '',
        isSuccess: false,
        materiels: [],
      };
    },
    methods: {
      async postProblem(event) {
        event.preventDefault();
        if (
          this.utilisateur.description != '' &&
          this.utilisateur.materiel != ''
        ) {
          const data = await post('probleme', this.utilisateur);

          if (data.response === 201) {
            this.isSuccess = true;
            Swal(
              'Oops !',
              'Veuillez réessayer dans quelques instants...',
              'warning'
            );
          } else {
            Swal.fire(
              'Merci',
              'Votre demande a été envoyé avec succès.',
              'success'
            );
            this.utilisateur.description = '';
            this.utilisateur.materiel = '';
            this.isSuccess = false;
          }
        } else {
          //this.responseText = "Veuillez remplir tous les champs";
          displayMessage('U-EmpF');
        }
      },
      async loadMaterielInUserDesk() {
        //Recharger tous le materiels présents dans le bureau
        const result = await load('materiels/all?statut=Disponible');
        this.materiels = result.data;
      },
      async getUserProblems() {
        // const userProblems = await load("probleme?sender="+this.utilisateur.sender);
        // this.materiels = result.data;
      },
    },
    mounted() {
      redirectIfNotLogin(this.$router);
        console.log(getCurrentSessionUser());
      Notification.requestPermission((status) => {
        console.log(status);
      });
      this.loadMaterielInUserDesk();
    },
  };
</script>

<style>
  .problem-container {
    margin-top: 100px;
  }
</style>
