<template>
  <div class="container">
    <SubHeader
      entity="Suivi de la tâche"
      isForProblems="yes"
      :nbrOfTask="problems.length"
      needSearchBar="no"
    />
    <!-- <div class="trie" v-if="userStatut != 'administrateur'">
      <div>
        <input
          type="radio"
          name="trier"
          v-model="sortedBy"
          value="all"
          id="all"
        />
        <label for="all">All</label>
      </div>
      <div>
        <input
          type="radio"
          name="trier"
          v-model="sortedBy"
          value="true"
          id="enCours"
        />
        <label for="enCours">En cours</label>
      </div>
      <div>
        <input
          type="radio"
          name="trier"
          v-model="sortedBy"
          value="false"
          id="enAttente"
        />
        <label for="enAttente">En Attente</label>
      </div>
      <div>
        <input
          type="radio"
          name="trier"
          v-model="sortedBy"
          value="end"
          id="termine"
        />
        <label for="termine">Terminée</label>
      </div>
    </div> -->

    <Loader :data="problems" />

    <div class="statsContainer">
      <div class="statDiv">
        <div class="divIcon">
          <span
            class="fas fa-arrow-right icon"
            style="background-color: #eef2fa; color: blue"
          ></span>
        </div>
        <div class="stats">
          <strong>{{ stats.new }}</strong>
          <span style="font-size: 12px">Nouvelles requêtes</span>
        </div>
      </div>

      <div class="statDiv">
        <div class="divIcon">
          <span
            style="background-color: #fff4ec; color: #e07a2c"
            class="fas fa-ellipsis-h icon"
          ></span>
        </div>
        <div class="stats">
          <strong>{{ stats.pending }}</strong>
          <span style="font-size: 12px">Requêtes en attentes</span>
        </div>
      </div>

      <div class="statDiv">
        <div class="divIcon">
          <span
            style="background-color: #ebddf9; color: #9006c2"
            class="fas fa-ellipsis-h icon"
          ></span>
        </div>
        <div class="stats">
          <strong>{{ stats.inProgress }}</strong>
          <span style="font-size: 12px">Requêtes en cours</span>
        </div>
      </div>

      <div class="statDiv">
        <div class="divIcon">
          <span
            class="fas fa-check icon"
            style="background-color: #e6faee; color: #287d3c"
          ></span>
        </div>
        <div class="stats">
          <strong>{{ stats.finished }}</strong>
          <span style="font-size: 12px">Requêtes terminées</span>
        </div>
      </div>
    </div>

    <!-- <div class="divBeforeTable">
      <h3>Requêtes reçentes</h3>
      <a href="#"
        >Voir toutes les requêtes <span class="fas fa-arrow-right"></span
      ></a>
    </div> -->

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
              v-for="(p, index) in filtered()"
              :key="p._id"
            >
              <td :class="showPbClass[index]">{{ index + 1 }}</td>
              <td>{{ p.sender.fonction }} - {{ p.sender.direction.code }}</td>
              <td>{{ p.sender.nom }} {{ p.sender.prenom }}</td>
              <td>{{  new Date(p.sender.createdAt).toLocaleString() }}</td>
              <td>
                <i
                  class="fas fa-circle statusEnCours"
                  v-if="p.statut == 'true' && p.isProgress == true"
                >
                  <span>En cours</span>
                </i>
                <i
                  class="fas fa-circle statusEnAttente"
                  v-else-if="p.statut == 'false'"
                >
                  <span>En attente</span>
                </i>
                <i
                  class="fas fa-circle statusTermine"
                  v-else-if="p.isProgress == false"
                >
                  <span>Terminé</span>
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

    <!--  <div class=" container-tiket">
      <section
        id="app"
        class="section container"
        v-for="(p, index) in filtered()"
        :key="p._id"
      >
        <article class="message" :class="showPbClass[index]" >
          <div class="containerInfoProblem">
            <div class="deskAndTime">
              <div class="desk">
                <h4 style="font-weight: 200; font-size:15px;">
                  <i class="fa fa-map-marker"></i>
                  {{ p.sender.fonction }} -
                  {{ p.sender.direction.code }}
                </h4>
              </div>
              <div class="Time">
                <i class="fa fa-clock"></i>{{ p.createdAt[3] | timing}}
              </div>
            </div>

            <div class="nameAndDate">
              <div class="name">
                <h5 v-if="p.sender != 'null'">
                  {{ p.sender.nom }} - {{ p.sender.prenom }}
                </h5>
              </div>
              <div>
                <i
                  v-if="p.statut == 'true' && p.isProgress == true"
                  class="fas fa-sync"
                >
                  En cours</i
                >
                <i v-else-if="p.statut == 'false'" class="fas fa-sync">
                  En attente</i
                >
                <i v-else-if="p.isProgress == false" class="fas fa-sync">
                  Terminée</i
                >
              </div>
            </div>
          </div>

          <div class="message-header" @click="showPb(index)">
            Voir le Problème
          </div>
          <div class="message-body">
            <div class="problem">
              <li>
                <span class="titleLi">EXECUTER PAR </span>
                <p v-if="p.executeBy != 'null'" style="margin-top:10px;">
                  {{ p.executeBy.prenom }} {{ p.executeBy.nom }}
                </p>
                <p v-else style="margin-top:10px;">Pas encore assigné</p>
              </li>
              <li>
                <span class="titleLi">MATERIEL CONCERNE </span><br />
                <p>{{ p.materiel[0].libelle }}</p>
              </li>
              <li>
                <span class="titleLi">DESCRIPTION DU PROBLEME</span><br />
                <p>{{ p.description }}</p>
              </li>
              <li v-if="p.materiel.length == 2 && p.statut == 'false'">
                <span class="titleLi">MATERIEL DEMANDE</span><br />
                <p>{{ p.materiel[1].libelle }}</p>
              </li>
              <li v-else>
                <span class="titleLi">MATERIEL DEMANDE </span>
                <p>L'intervention ne requiert pas un nouveau matériel</p>
              </li>
              <li v-if="userStatut != 'administrateur'">
                <span class="titleLi">SOLUTIONS PRECONISEES : </span>
                <span v-if="p.solutionPreconise.length != 0">
                  <ul
                    v-for="(solution, index) in p.solutionPreconise"
                    :key="index"
                  >
                    <li class="listSolutions">{{ solution }}</li>
                  </ul>
                  <textarea
                    v-if="
                      p.solutionPreconise.length % 2 != 0 && p.statut == 'false'
                    "
                    rows="1"
                    type="text"
                    class="textarea sp"
                    placeholder="ENTRER LA SOLUTION PRECONISEE"
                  >
                  </textarea>

                  <div>
                    <button
                      v-if="p.statut == 'false'"
                      class="button"
                      @click="sendDiagnostique(p)"
                    >
                      Envoyer Le Diagnostique
                    </button>
                  </div>
                </span>
                <p v-else>
                  Aucune solution n'a encore été préconisée
                </p>
              </li>
              <li v-if="p.isProgress == 'false'">
                <span>Date de fin : </span>
                <p>{{ p.endAt }}</p>
              </li>
              <li
                v-if="
                  p.solutionPreconise.length % 2 != 0 && p.statut == 'false' && userStatut != 'administrateur'
                "
              >
                <button @click="approuve(p)" class="button">
                  APPROUVER LA SOLUTION
                </button>
              </li>
            </div>
          </div>
        </article>
      </section>
    </div> -->
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import {
    changeTitle,
    displayMessage,
    getTimeElapsedSinceGettingTask,
    load,
    update,
  } from '../../services/functions';
  import { getCurrentSessionUser } from '../../services/storage';
  import Loader from '../General/Loader.vue';
  import SubHeader from '../General/SubHeader.vue';

  export default {
    components: {
      SubHeader,
      Loader,
    },
    name: 'SuiviT',
    data() {
      return {
        loading: true,
        probleme: {
          sp: '',
        },
        sortedBy: 'all',
        techniciens: [],
        problems: [],
        user: getCurrentSessionUser(),
        selected: null,
        sp: '',
        emptyTache: "Vous n'avez aucune tâche !",
        isApprouved: false,
        timeWhereTaskWasApprouved: '',
        isOpen: [],
        toogleTicket: '',
        userStatut: getCurrentSessionUser().statut,
        approved: true,
        chefDivisions: [],
      };
    },
    methods: {
      async loadAllTechniciensProblems() {
        var chefD = await load('probleme?isProgress=false');
        this.chefDivisions = chefD.data;
      },
      async loadProblemAssignedToTech() {
        // probleme?tutelle="+this.user.tutelle+"&assignedTo="+this.user._id)
        if (this.userStatut == 'administrateur') {
          var p = await load('probleme');
          this.problems = p.data;
          this.isOpen = new Array(this.problems.length).fill(false);
        } else {
          p = await load(
            'probleme?assignedTo=' + this.user._id + '&solutionPreconise=true'
          );
          this.problems = p.data;
          this.isOpen = new Array(this.problems.length).fill(false);
        }
      },

      async sendDiagnostique(p) {
        var sp = document.querySelector('.sp').value;
        if (sp === '') {
          alert('Veuillez remplir tous les champs');
        } else {
          p.solutionPreconise.push(sp);
          const res = await update('probleme/' + p._id, {
            solutionPreconise: p.solutionPreconise,
          });
          if (res.status === 201) {
            displayMessage('Ass');
            alert(
              'Votre solution preconisé a été envoyé. Attendre la réponse de ' +
                p.executeBy.nom +
                ' ' +
                p.executeBy.prenom
            );
          }
          this.loadProblemAssignedToTech();
        }
      },
      filtered() {
        if (this.sortedBy === 'end')
          return (this.filteredP = this.problems.filter(
            (problem) => problem.isProgress === false
          ));
        if (this.sortedBy === 'all') {
          return (this.filteredP = this.problems);
        } else {
          return (this.filteredP = this.problems.filter(
            (problem) =>
              problem.statut === this.sortedBy && problem.isProgress === true
          ));
        }
      },
      async approuve(p) {
        /*
        Change le statut du materiel demandé en "Preté" et autorise le pret

      */
        let id = p._id;
        if (p.materiel.length == 2) {
          let materielDemande = p.materiel[1]._id;
          p.createdAt.push(new Date().toISOString());
          var c = await update('materiels/' + materielDemande, {
            status: 'Indisponible',
            createdAt: p.createdAt,
          });
          var o = await update('probleme/' + id, { statut: true });
          console.log(c, o);
          this.approved = true;
          Swal.fire(' ', 'Tache approuvé', 'success');
          this.loadProblemAssignedToTech();
        } else {
          await update('probleme/' + id, { statut: true });
          this.approved = true;
          Swal.fire(' ', 'Tache approuvé', 'success');
        }
      },
      showPb: function (i) {
        this.isOpen[i] = !this.isOpen[i];
        this.isOpen = [...this.isOpen];
      },
      seeDetails(id) {
        this.$router.push('/admin/details/' + id);
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
      stats: function () {
        return {
          new: this.problems.filter((p) => p.statut == 'false').length,
          pending: this.problems.filter((p) => p.statut == 'false').length,
          inProgress: this.problems.filter(
            (p) => p.statut == 'true' && p.isProgress == true
          ).length,
          finished: this.problems.filter(
            (p) => p.statut == 'true' && p.isProgress == false
          ).length,
        };
      },
    },
    mounted() {
      this.loadProblemAssignedToTech();
      // this.sendDiagnostique();
      changeTitle(this.$route.name);
      this.loadAllTechniciensProblems();
    },
    filters: {
      timing(time) {
        return getTimeElapsedSinceGettingTask(time);
      },
    },
  };
</script>

<style scope>
  /* Cyrus */
  .statsContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .statDiv {
    background: #ffffff;
    border: 1px solid #a5abb3;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    padding: 25px;
    margin: 15px 0px 25px 0px;
    width: 24%;
  }
  .stats {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .divIcon {
    margin-right: 15px;
  }
  .divIcon .icon {
    border-radius: 100%;
    padding: 12px;
  }
  .container {
    padding: 15px;
    width: 100%;
  }
  .divBeforeTable {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2%;
  }
  #table-wrapper {
    position: relative;
  }
  #table-scroll {
    height: 55vh;
    overflow: auto;
    margin-top: 20px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    border: 1px solid transparent;
    overflow-y: scroll;
  }
  th {
    background-color: #e4eee3;

    position: sticky;
    top: 0;
  }
  td {
    background-color: #ffffff;
  }
  td,
  th {
    text-align: left;
    padding: 15px;
    border-bottom: 1px solid #ccc;
  }
  button {
    padding: 8px;
    background-color: #ffffff;
    border: 1px solid #6d7580;
    border-radius: 6px;
  }

  /* FIN CYRUS */

  .trie {
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background-color: #dcdcdc80;
    width: 80%;
  }
  .container-ticket {
    margin: 0 auto;
  }
  .success {
    margin: 0 auto;
  }
  .trie input {
    margin-right: 10px;
  }

  /* ticket */
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
  .listSolutions {
    border: none;
    list-style-type: circle;
    list-style-type: style color;
    margin-left: 0px;
    padding: 1px;
  }
  textarea {
    border: 1px solid gray;
    border-radius: 1px;
    outline: none;
  }

  .statusEnCours {
    color: #9006c2;
    padding: 4px 8px;
    border-radius: 40px;
    background: #f9ebfe;
    font-size: 15px;
  }
  .statusEnAttente {
    padding: 4px 8px;
    border-radius: 40px;
    color: #d96c19;
    background: #fcf1e8;
  }
  .statusTermine {
    padding: 4px 8px;
    border-radius: 40px;
    background: #edf9f0;
    color: green;
  }
  .statusEnCours span,
  .statusEnAttente span,
  .statusTermine span {
    margin-left: 5px;
  }
</style>
