<template>
  <div>
    <SubHeader
      entity="Suivi de la tâche"
      isForProblems="yes"
      :nbrOfTask="problems.length"
      needSearchBar="no"
    />
    <div class="trie" v-if="userStatut != 'administrateur'">
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
    </div>

    <div class=" container-tiket">
      <Loader :data="problems"/>
      <section
        id="app"
        class="section container"
        v-for="(p, index) in filtered()"
        :key="p._id"
      >
      <!--  v-if="userStatut === 'administrateur' && p.isProgress === false" -->
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
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { changeTitle, displayMessage, getTimeElapsedSinceGettingTask, load, update } from "../../services/functions";
import { getCurrentSessionUser } from "../../services/storage";
import Loader from '../General/Loader.vue';
import SubHeader from "../General/SubHeader.vue";

export default {
  components: {
    SubHeader,
    Loader
  },
  name: "SuiviT",
  data() {
    return {
      loading: true,
      probleme: {
        sp: "",
      },
      sortedBy: "all",
      techniciens: [],
      problems: [],
      user: getCurrentSessionUser(),
      selected: null,
      sp: "",
      emptyTache: "Vous n'avez aucune tâche !",
      isApprouved: false,
      timeWhereTaskWasApprouved: "",
      isOpen: [],
      toogleTicket: "",
      userStatut: getCurrentSessionUser().statut,
      approved: true,
      chefDivisions: []
    };
  },
  methods: {
    async loadAllTechniciensProblems() {
      var chefD = await load("probleme?isProgress=false");
      this.chefDivisions = chefD.data;
    },
    async loadProblemAssignedToTech() {
      // probleme?tutelle="+this.user.tutelle+"&assignedTo="+this.user._id)
      if ( this.userStatut == 'administrateur') {
         var p = await load("probleme?isProgress=false");
        this.problems = p.data;
        this.isOpen = new Array(this.problems.length).fill(false);
      }
      else {
         p = await load("probleme?assignedTo="+this.user._id+
            "&solutionPreconise=true");
        this.problems = p.data;
        this.isOpen = new Array(this.problems.length).fill(false);
      }
    },

    async sendDiagnostique(p) {
      var sp = document.querySelector(".sp").value;
      if (sp === "") {
        alert("Veuillez remplir tous les champs");
      } else {
        p.solutionPreconise.push(sp);
        const res = await update("probleme/" + p._id, { solutionPreconise: p.solutionPreconise })
        if (res.status === 201) {
         displayMessage("Ass");
          alert(
            "Votre solution preconisé a été envoyé. Attendre la réponse de " +
              p.executeBy.nom +
              " " +
              p.executeBy.prenom
          );
        }
        this.loadProblemAssignedToTech();
      }
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
    async approuve(p) {
      /*
        Change le statut du materiel demandé en "Preté" et autorise le pret

      */
      let id = p._id;
      if (p.materiel.length == 2) {
        let materielDemande = p.materiel[1]._id;
        p.createdAt.push(new Date().toISOString());
        var c = await update("materiels/" + materielDemande, { status: "Indisponible",createdAt: p.createdAt});
        var o = await update("probleme/" + id,{ statut:true });
        console.log(c, o)
        this.approved = true;
        Swal.fire(" ","Tache approuvé", "success")
        this.loadProblemAssignedToTech();
      } else {
        await update("probleme/" + id,{ statut: true })
        this.approved = true;
        Swal.fire(" ","Tache approuvé", "success")
      }
    },
    showPb: function(i) {
      this.isOpen[i] = !this.isOpen[i];
      this.isOpen = [...this.isOpen];
    },
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
  },
  mounted() {
    this.loadProblemAssignedToTech();
    // this.sendDiagnostique();
    changeTitle(this.$route.name)
    this.loadAllTechniciensProblems()
  },
  filters: {
    timing(time) {
      return getTimeElapsedSinceGettingTask(time);
    },
  },
};
</script>

<style scope>
.trie {
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #dcdcdc80;
  width: 80%;
}
.container-ticket{
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
</style>
