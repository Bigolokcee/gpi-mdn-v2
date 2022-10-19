<template>
  <div class="container">
    <SubHeader
      entity="Suivi des tâches"
      isForProblems="yes"
      :nbrOfTask="filteredP.length"
      needSearchBar="no"
    />
    <!--  <div class="trie">
      <div>
        <input
          type="radio"
          name="trier"
          @updateChildProps="updateP"
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
          @updateChildProps="updateP"
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
          @updateChildProps="updateP"
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
          @updateChildProps="updateP"
          v-model="sortedBy"
          value="end"
          id="termine"
        />
        <label for="termine">Terminée</label>
      </div>
    </div> -->

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
            class="fas fa-ellipsis-h icon"
            style="background-color: #ebddf9; color: #9006c2"
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
            class="fas fa-ellipsis-h icon"
            style="background-color: #fff4ec; color: #e07a2c"
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

    <div class="divBeforeTable">
      <h3>Requêtes reçentes</h3>
      <a href="#"
        >Voir toutes les requêtes <span class="fas fa-arrow-right"></span
      ></a>
    </div>

    <div id="table-wrapper">
      <div id="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Réf</th>
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
              <td>{{ p.createdAt[2] | timing }}</td>
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
                <button>Voir détails</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--  <div class="container-tiket">
      <section
        id="app"
        class="section container"
        v-for="(p, index) in filtered()"
        :key="p._id"
      >
        <article class="message" :class="showPbClass[index]">
          <div class="containerInfoProblem">
            <div class="deskAndTime">
              <div class="desk">
                <h4 style="font-weight: 200; font-size:15px;">
                  <i class="fa fa-map-marker"></i>{{ p.sender.fonction }} -
                  {{ p.sender.direction.code }}
                </h4>
              </div>
              <div class="Time">
                <h4>
                  <i class="fa fa-clock"></i> {{ p.createdAt[2] | timing }}
                </h4>
              </div>
            </div>

            <div class="nameAndDate">
              <div class="name">
                <h5>{{ p.sender.nom }} - {{ p.sender.prenom }}</h5>
              </div>
              <div class="Date">
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
                <span class="titleLi">MATERIEL CONCERNE </span>
                <p>
                  {{ p.materiel[0].libelle }}
                </p>
              </li>
              <li v-if="p.statut == 'false'">
                <label class="titleLi" for="needMateriel"
                  >BESOIN DE MATERIEL ?</label
                >
                <input
                  type="radio"
                  @click="needMateriel = true"
                  name="needMateriel"
                  class="needMateriel oui"
                  id="oui"
                  style="padding:50px;"
                /><label for="oui">Oui</label>
                <input
                  v-on:click="needMateriel = false"
                  type="radio"
                  name="needMateriel"
                  id="non"
                  class="needMateriel non"
                  checked
                /><label for="non">Non</label>

                <div v-if="needMateriel">
                  <select name="" v-model="materiel" class="selectMateriel">
                    <option value="">Selectionner le materiel</option>
                    <option
                      v-for="data in materiels"
                      :key="data._id"
                      :value="data._id"
                      >{{ data.libelle }}</option
                    >
                  </select>
                </div>
              </li>
              <li>
                <span class="titleLi">DESCRIPTION DU PROBLEME </span><br />
                <p>{{ p.description }}</p>
              </li>
              <li v-if="p.isProgress == false">
                <b>MATERIEL DEMANDE</b>
                <p v-if="p.materiel.length == 2">{{ p.materiel[1].libelle }}</p>
                <p v-else>L'intervention ne requiert pas un nouveau matériel</p>
              </li>
              <li>
                <b>SOLUTIONS PRECONISEES</b>
                <ul
                  v-for="(solution, index) in p.solutionPreconise"
                  :key="index"
                >
                  <li class="listSolutions">{{ solution }}</li>
                </ul>
                <div
                  v-if="
                    p.solutionPreconise.length % 2 == 0 && p.statut == 'false'
                  "
                  class="message-content"
                >
                  <textarea
                    rows="1"
                    type="text"
                    class="textarea"
                    placeholder="ENTRER LA SOLUTION PRECONISEE"
                  >
                  </textarea>
                  <div>
                    <button class="button" @click="sendDiagnostique(p)">
                      Envoyer Diagnostique
                    </button>
                  </div>
                </div>
              </li>
              <li v-if="p.statut == 'true' && p.isProgress == true">
                <button class="button" @click="endIntervention(p)">
                  FIN DE L'INTERVENTION
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
  import { getCurrentSessionUser } from '../../services/storage';
  import SubHeader from '../General/SubHeader.vue';
  import {
    displayMessage,
    getTimeElapsedSinceGettingTask,
    load,
    update,
  } from '../../services/functions';
  import Swal from 'sweetalert2';

  export default {
    components: {
      SubHeader,
    },
    name: 'Diagnostique',

    data: function () {
      return {
        sortedBy: 'all',
        message: 'Aucune tache assignée',
        probleme: {
          sp: '',
        },
        problems: [],
        user: getCurrentSessionUser(),
        sp: '',
        toogleTicket: '',
        isOpened: true,
        isOpen: [],
        needMateriel: [],
        materiels: [],
        materiel: '',
        nbreTask: '',
        filteredP: [],
      };
    },
    methods: {
      updateP() {
        //alert("oj");
      },
      async loadProblems() {
        console.log(
          'probleme?executeBy=' + this.user._id + '&solutionPreconise=true'
        );
        const p = await load(
          'probleme?&executeBy=' + this.user._id + '&solutionPreconise=true'
        );

        const result = await load('materiels/all?statut=Disponible');
        this.materiels = result.data;

        this.problems = p.data;
        this.problems.reverse();

        this.isOpen = new Array(this.problems.length).fill(false);
        this.needMateriel = new Array(this.problems.length).fill(false);

        this.nbreTask = this.problems.length;
      },
      async endIntervention(p) {
        /*Termine le ticket
        Ajouter ca dans l'historique
        Renvoyer le ticket chez les supérieurs
        Supprimer la tache dans la liste des taches

      */
        //Changer le IsInProgress en false
        p.createdAt.push(new Date().toISOString());
        await update('probleme/' + p._id, {
          isProgress: false,
          endAt: new Date().toISOString(),
          createdAt: p.createdAt,
        });
        Swal.fire('', "Fin de l'intervention", 'success');
        this.loadProblems();
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
      async sendDiagnostique(p) {
        let sp = document.querySelector('.textarea').value;

        if (sp === '') {
          //alert("Veuillez remplir tous les champs");
          displayMessage('T-EmpT');
        } else {
          p.solutionPreconise.push(sp);

          if (this.materiel != '') {
            p.materiel.push(this.materiel);
            p.createdAt.push(new Date().toISOString());
            const res = await update('probleme/' + p._id, {
              solutionPreconise: p.solutionPreconise,
              materiel: p.materiel,
              createdAt: p.createdAt,
            });

            if (res.status === 201) {
              /* var message =
              "Votre solution preconisé a été envoyé. Attendre la réponse de " +
              p.assignedTo.nom +
              " " +
              p.assignedTo.prenom; */
              Swal.fire(
                'Assigné à ' + p.assignedTo.nom + ' ' + p.assignedTo.prenom,
                'message',
                'success'
              );
            } else {
              displayMessage('T-EmpF');
            }
            this.loadProblems();
          } else {
            const res = await update('probleme/' + p._id, {
              solutionPreconise: p.solutionPreconise,
            });

            if (res.status === 201) {
              /* var message =
              "Votre solution preconisé a été envoyé. Attendre la réponse de " +
              p.assignedTo.nom +
              " " +
              p.assignedTo.prenom; */
              Swal.fire(
                'Assigné à ' + p.assignedTo.nom + ' ' + p.assignedTo.prenom,
                'message',
                'success'
              );
            } else {
              displayMessage('T-EmpF');
            }
            this.loadProblems();
          }
        }
      },

      showPb: function (i) {
        this.isOpen[i] = !this.isOpen[i];
        this.isOpen = [...this.isOpen];
      },
      showMateriel(index) {
        this.needMateriel[index] = !this.needMateriel[index];
        this.needMateriel = [...this.needMateriel];
        console.log(this.needMateriel);
      },
    },
    async mounted() {
      this.loadProblems();
      this.sendDiagnostique();
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
      isNeedMateriel: function () {
        const ok = [];

        this.needMateriel.forEach((it) => ok.push(it));
        return ok;
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
      /* statut(){ 
    
     return this.problems.solutionPreconise.length % 2 === 0 ? "En cours" : "En attente de comfirmation";
    } */
    },
    filters: {
      timing(time) {
        return getTimeElapsedSinceGettingTask(time);
      },
    },
  };
</script>

<style scoped>
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
  .trie input {
    margin-right: 10px;
  }

  /*ticket*/
  li {
    list-style-type: square;
  }
  .titleLi {
    font-weight: bold;
  }
  textarea {
    border: 1px solid gray;
    border-radius: 1px;
    outline: none;
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
