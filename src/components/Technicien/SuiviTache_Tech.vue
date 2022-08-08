<template>
  <div>
    <SubHeader
      entity="Suivi des tâches"
      isForProblems="yes"
      :nbrOfTask="filteredP.length"
      needSearchBar="no"
    />
    <div class="trie">
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
    </div>

    <div class="container-tiket">
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
    </div>
  </div>
</template>

<script>
import { getCurrentSessionUser } from "../../services/storage";
import SubHeader from "../General/SubHeader.vue";
import {
  displayMessage,
  getTimeElapsedSinceGettingTask,
  load,
  update,
} from "../../services/functions";
import Swal from "sweetalert2";

export default {
  components: {
    SubHeader,
  },
  name: "Diagnostique",

  data: function() {
    return {
      sortedBy: "all",
      message: "Aucune tache assignée",
      probleme: {
        sp: "",
      },
      problems: [],
      user: getCurrentSessionUser(),
      sp: "",
      toogleTicket: "",
      isOpened: true,
      isOpen: [],
      needMateriel: [],
      materiels: [],
      materiel: "",
      nbreTask: "",
      filteredP: [],
    };
  },
  methods: {
    updateP() {
      //alert("oj");
    },
    async loadProblems() {
      console.log("probleme?executeBy="+this.user._id + "&solutionPreconise=true")
      const p = await load("probleme?&executeBy="+this.user._id + "&solutionPreconise=true");
    
      const result = await load("materiels/all?statut=Disponible")
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
      await update("probleme/" + p._id, {
        isProgress: false,
        endAt: new Date().toISOString(),
        createdAt: p.createdAt,
      });
      Swal.fire("", "Fin de l'intervention", "success");
      this.loadProblems();
    },
    filtered() {
      if (this.sortedBy === "end")
        return (this.filteredP = this.problems.filter(
          (problem) => problem.isProgress === false
        ));
      if (this.sortedBy === "all") {
        return (this.filteredP = this.problems);
      } else {
        return (this.filteredP = this.problems.filter(
          (problem) =>
            problem.statut === this.sortedBy && problem.isProgress === true
        ));
      }
    },
    async sendDiagnostique(p) {
      let sp = document.querySelector(".textarea").value;

      if (sp === "") {
        //alert("Veuillez remplir tous les champs");
        displayMessage("T-EmpT");
      } else {
        p.solutionPreconise.push(sp);

        if (this.materiel != "") {
          p.materiel.push(this.materiel);
          p.createdAt.push(new Date().toISOString());
          const res = await update("probleme/" + p._id, {
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
              "Assigné à " + p.assignedTo.nom + " " + p.assignedTo.prenom,
              "message",
              "success"
            );
          } else {
            displayMessage("T-EmpF");
          }
          this.loadProblems();
        } else {
          const res = await update("probleme/" + p._id, {
            solutionPreconise: p.solutionPreconise,
          });

          if (res.status === 201) {
            /* var message =
              "Votre solution preconisé a été envoyé. Attendre la réponse de " +
              p.assignedTo.nom +
              " " +
              p.assignedTo.prenom; */
            Swal.fire(
              "Assigné à " + p.assignedTo.nom + " " + p.assignedTo.prenom,
              "message",
              "success"
            );
          } else {
            displayMessage("T-EmpF");
          }
          this.loadProblems();
        }
      }
    },

    showPb: function(i) {
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
    showPbClass: function() {
      const openClasses = [];
      this.isOpen.forEach((it) =>
        openClasses.push({
          "is-closed": !it,
          "is-primary": it,
          "is-dark": it,
        })
      );
      return openClasses;
    },
    isNeedMateriel: function() {
      const ok = [];

      this.needMateriel.forEach((it) => ok.push(it));
      return ok;
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
hr {
  width: 95%;
  margin-left: 30px;
}
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
</style>
