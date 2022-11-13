<template>
  <div>
    <SubHeader
      entity="Assigner une tâche"
      isForProblems="yes"
      :nbrOfTask="problems.length"
      needSearchBar="no"
    />
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
              <td>{{  new Date(p.sender.createdAt).toLocaleString() }}</td>
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
                  <span>En cours (Chef Division "Cloture du problème")</span>
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
  </div>
</template>

<script>
  import { _WS_URL } from '../../services/environment';
  import { getCurrentSessionUser } from '../../services/storage';
  import {
    //displayMessage,
    getTimeElapsedSinceGettingTask,
    load,
    update,
  } from '../../services/functions';

  import SubHeader from '../General/SubHeader.vue';
  import Swal from 'sweetalert2';

  export default {
    components: {
      SubHeader,
    },
    data: function () {
      return {
        techniciens: [],
        problems: [],
        user: getCurrentSessionUser(),
        selected: null,
        emptyTache: "Vous n'avez aucune tâche !",
        toogleTicket: '',
        isOpened: false,
        currentBox: null,
        isOpen: [],
      };
    },
    methods: {
      seeDetails(id) {
        this.$router.push('/chefDivision/details/' + id);
      },

      select(e) {
        this.selected = e.target.value;
      },
      async loadProblems() {
        // "users?tutelle="+this.tutelleId+"&statut=chefDivision"
        const p = await load('probleme?assignedTo=' + this.user._id);

        this.problems = p.data;

        console.log(this.problems);
        this.isOpen = new Array(this.problems.length).fill(false);
      },
      async loadTechniciens() {
        const tech = await load('users/all?statut=technicien');
        this.techniciens = tech.data;
      },
      async assign(p) {
        p.executeBy = this.selected;
        p.createdAt.push(new Date().toISOString());
        await update('probleme/' + p._id, {
          executeBy: p.executeBy,
          createdAt: p.createdAt,
        });
        /*  await fetch(_SERVER_URL + "probleme/" + p._id, {
        method: "PUT",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      }); */

        Swal.fire('Assignée', 'La tâche a été assigné avec succès', 'success');
        this.loadProblems();
        this.socket.send(JSON.stringify(p));
      },
      async handleWs() {
        console.log(_WS_URL + 'probleme/chefDivision');
        const cd = new WebSocket(_WS_URL + 'probleme/chefDivision');
        this.socket = cd;

        this.socket.onopen = (event) => {
          console.log('Socket connected', event);
          cd.onmessage = (msg) => {
            if (this.user.statut === 'technicien') {
              const n = new Notification(
                'Nouvelle intervention du chef Division'
              );
              console.log(n, msg);
            }
          };
        };
      },
      showPb: function (i) {
        this.isOpen[i] = !this.isOpen[i];
        this.isOpen = [...this.isOpen];
      },
    },

    mounted() {
      this.assign();
      this.loadProblems();
      this.loadTechniciens();
      this.handleWs();
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

<style scoped>
  .emptyTache {
    background-color: #ccc;
    width: 50%;
    margin: 0 auto;
    margin-top: 15px;
  }
  .success {
    position: absolute;
    top: 40%;
    left: 10%;
  }
  .headertask {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .titleLi {
    font-weight: bold;
  }
  li {
    list-style-type: square;
  }
  p {
    margin-top: 10px;
    margin-left: 22px;
    font-size: 18px;
  }
  .button {
    padding: 5px;
    border-radius: 5px;
  }
</style>
