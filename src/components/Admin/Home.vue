<template>
  <div>
    <!-- entete des requetes -->
    <!--  -->
    <SubHeader
      entity="Requêtes"
      isForProblems="yes"
      :nbrOfTask="problems.length"
      needSearchBar="no"
    />
    <Loader :data="problems" />

    <div id="table-wrapper">
      <div id="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Référence de la requête</th>
              <th>Source</th>
              <th>Auteur</th>
              <th>Date de la requête</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              id="app"
              class="section container"
              v-for="(p, index) in problems"
              :key="p._id"
            >
              <td :class="showPbClass[index]">{{ index + 1 }}</td>
              <td>{{ p.sender.fonction }} - {{ p.sender.direction.code }}</td>
              <td>{{ p.sender.nom }} {{ p.sender.prenom }}</td>
              <td>{{  new Date(p.createdAt).toLocaleString() }}</td>
              <td>
                <i
                  class="fas fa-circle statusEnAttente"
                  v-if="p.statut == 'false'"
                >
                  <span>Nouveau</span>
                </i>
                <i
                  class="fas fa-circle statusTermine"
                  v-else-if="p.isProgress == false"
                >
                  <span>Terminé</span>
                </i>
                <i
                  class="fas fa-circle statusEnCours"
                  v-if="p.statut == 'en-cours-1' && p.isProgress == true"
                >
                  <span>En cours(Chef Division "Assigner Technicien")</span>
                </i>
                <i
                  class="fas fa-circle statusEnCours"
                  v-else-if="p.statut == 'en-cours-2' && p.isProgress == true"
                >
                  <span>En cours (Technicien "Proposition Solution")</span>
                </i>
                <i
                  class="fas fa-circle statusEnCours"
                  v-else-if="p.statut == 'en-cours-3' && p.isProgress == true"
                >
                  <span>En cours (Chef Division "Approbation Solution")</span>
                </i>
                <i
                  class="fas fa-circle statusEnCours"
                  v-else-if="p.statut == 'en-cours-4' && p.isProgress == true"
                >
                  <span>En cours (Technicien "Réparation")</span>
                </i>
                <i
                  class="fas fa-circle statusEnCours"
                  v-else-if="p.statut == 'en-cours-5' && p.isProgress == true"
                >
                  <span>En cours (Chef Division "Cloture de la requête")</span>
                </i>
              </td>
              <td>
                <button @click="seeDetails(p._id)">Voir détails</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- body requete -->
    <!-- <h1 v-if = "problems.length === 0" style="text-align: center">Vous n'avez aucune tache en cours !</h1> -->
    <!--  <Ticket :problems="problems" /> -->
  </div>
</template>

<script>
  /* document.querySelector('.message-header').addEventListener('click', showPb);

    function showPb(){
      document.querySelector('message').classList.add('is-closed')
      if (isOpened)
        document.querySelector('message').style.maxHeight = '0'
      else
        document.querySelector('message').style.maxHeight = '10em'
    } */

  import { _WS_URL } from '../../services/environment';
  import {
    //displayMessage,
    getTimeElapsedSinceGettingTask,
  } from '../../services/functions';
  import { getCurrentSessionUser } from '../../services/storage';
  import SubHeader from '../General/SubHeader.vue';
  import Loader from '../General/Loader.vue';
  // import Pagination from '../Formulaire/Pagination.vue';
  import { load, update } from '../../services/functions';
  import Swal from 'sweetalert2';

  //import Ticket from '../General/Ticket.vue'
  export default {
    components: { SubHeader, Loader },
    name: 'Home',

    data() {
      return {
        isOpen: [],
        problems: [],
        chefDivisions: [],
        selected: null,
        socket: null,
        user: getCurrentSessionUser(),
        toogleTicket: '',
        nbreTask: '',
        /*accordion*/
        isOpened: true,
        problemReduce: [],
        tutelleId: getCurrentSessionUser().tutelle,
        admins: [],
        superAdminData: [],
        /*  showPbClass:{
       'is-closed':this.isOpen
     } */
      };
    },

    mounted() {
      this.loadProblems();
      this.loadChefDivisions();
      this.handleWs();
      this.assign();
    },
    /*  computed:{
    addClassList(){
      return ''
    }
  }, */

    methods: {
      select(e) {
        this.selected = e.target.value;
      },

      seeDetails(id) {
        this.$router.push('/admin/details/' + id);
      },

      async loadProblems() {
        /*  Afficher les problemes selon la Tutelle*/
        // const p = await load("probleme?§"+this.tutelleId);
        // const p = await load("probleme?tutelle="+this.tutelleId);
        const p = await load('probleme');
        this.problems = p.data;
        console.log(this.tutelleId);
        this.isOpen = new Array(this.problems.length).fill(false);

        this.nbreTask = this.problems.length;
      },

      async loadChefDivisions() {
        // const c = await load("users?tutelle="+this.tutelleId+"&statut=chefDivision");
        const c = await load('users/all?statut=chefDivision');
        this.chefDivisions = c.data;
      },

      async assign(p) {
        p.assignedTo = this.selected;
        p.createdAt.push(new Date().toISOString());

        await update('probleme/' + p._id, {
          assignedTo: p.assignedTo,
          createdAt: p.createdAt,
        });

        //displayMessage("T-Ass");
        Swal.fire('Assignée', 'La tâche a été assigné avec succès', 'success');
        this.loadProblems();
        // this.socket.send(JSON.stringify(p));
      },
      async handleWs() {
        const ws = new WebSocket(_WS_URL + 'probleme/admin');
        this.socket = ws;

        this.socket.onopen = (event) => {
          console.log('Socket connected', event);
          ws.onmessage = (msg) => {
            const n = new Notification('Nouveau message');
            console.log(n, msg);
          };
        };
      },
      async loadAdmins() {
        var superAdmin = 'root';
        // Charge tous les admins de la tutelle du Super Admin
        var spData = await load('users/all?statut=' + superAdmin);
        this.superAdminData = spData.data;

        // var adminData = await load("users?tutelleCode="this.superAdminData[0].tutelle._);
      },

      showPb: function (i) {
        this.isOpen[i] = !this.isOpen[i];
        this.isOpen = [...this.isOpen];
        console.log(this.showPbClass, this.isOpen);
      },
    },

    computed: {
      showPbClass: function () {
        const openClasses = [];
        this.isOpen.forEach((it) =>
          openClasses.push({
            'is-closed': !it,
            'is-primary': it,
            'is-dark': it,
          })
        );
        return openClasses;
      },
    },

    filters: {
      timing(time) {
        return getTimeElapsedSinceGettingTask(time);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .container__direction {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .button {
    padding: 5px;
    border-radius: 5px;
  }
  li {
    list-style-type: square;
  }
  .titleLi,
  label {
    font-weight: bold;
  }
  .listSolutions {
    border: none;
    list-style-type: circle;
    list-style-type: style color;
    margin-left: 0px;
    padding: 1px;
  }
  p {
    margin-top: 10px;
    margin-left: 22px;
    font-size: 18px;
  }
</style>
