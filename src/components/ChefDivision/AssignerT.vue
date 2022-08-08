<template>
  <div>
    <SubHeader
      entity="Assigner une tâche"
      isForProblems="yes"
      :nbrOfTask="problems.length"
      needSearchBar="no"
    />
    <div class="container-tiket">
      <div v-if="problems.length === 0" class="success">
        <div>{{ emptyTache }}</div>
      </div>
      <!-- Ticket  -->
      <section
        id="app"
        class="section container"
        v-for="(p, index) in problems"
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
                <i class="fa fa-clock"></i>{{ p.createdAt[1] | timing }}
              </div>
            </div>
            <div class="nameAndDate">
              <div class="name">
                <h5>{{ p.sender.nom }} - {{ p.sender.prenom }}</h5>
              </div>
              <div>
                <i class="fas fa-sync"> En attente</i>
              </div>
            </div>
          </div>

          <div class="message-header" @click="showPb(index)">
            Voir le Problème
          </div>
          <div class="message-body">
            <div class="problem">
              <li>
                <span class="titleLi">MATERIEL CONCERNE </span><br />
                <p>{{ p.materiel[0].libelle }}</p>
              </li>
              <li>
                <span class="titleLi">DESCRIPTION DU PROBLEME</span><br />
                <p>{{ p.description }}</p>
              </li>
            </div>
            <div class="message-content"></div>
            <p>
              <select @change="select" class="selectMateriel">
                <option value="">Selectionner un technicien</option>
                <option v-for="t in techniciens" :key="t._id" :value="t._id"
                  >{{ t.nom }} {{ t.prenom }}</option
                >
              </select>

              <button @click="assign(p)" class="button">
                ASSIGNER LA TACHE
              </button>
            </p>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script>
import { _WS_URL } from "../../services/environment";
import { getCurrentSessionUser } from "../../services/storage";
import {
  //displayMessage,
  getTimeElapsedSinceGettingTask, load, update,
} from "../../services/functions";

import SubHeader from "../General/SubHeader.vue";
import Swal from "sweetalert2";

export default {
  components: {
    SubHeader,
  },
  data: function() {
    return {
      techniciens: [],
      problems: [],
      user: getCurrentSessionUser(),
      selected: null,
      emptyTache: "Vous n'avez aucune tâche !",
      toogleTicket: "",
      isOpened: false,
      currentBox: null,
      isOpen: [],
    };
  },
  methods: {
    select(e) {
      this.selected = e.target.value;
    },
    async loadProblems() {
      
      // "users?tutelle="+this.tutelleId+"&statut=chefDivision"
      const p = await load("probleme?assignedTo="+this.user._id)

      this.problems = p.data;

      console.log(this.problems)
      this.isOpen = new Array(this.problems.length).fill(false);
    },
    async loadTechniciens() {
      const tech = await load("users/all?statut=technicien");
      this.techniciens = tech.data;
    },
    async assign(p) {
      p.executeBy = this.selected;
      p.createdAt.push(new Date().toISOString());
      await update('probleme/'+p._id, {
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

      Swal.fire("Assignée", "La tâche a été assigné avec succès", "success");
      this.loadProblems();
      this.socket.send(JSON.stringify(p));
    },
    async handleWs() {
      console.log(_WS_URL + "probleme/chefDivision");
      const cd = new WebSocket(_WS_URL + "probleme/chefDivision");
      this.socket = cd;

      this.socket.onopen = (event) => {
        console.log("Socket connected", event);
        cd.onmessage = (msg) => {
          if (this.user.statut === "technicien") {
            const n = new Notification(
              "Nouvelle intervention du chef Division"
            );
            console.log(n, msg);
          }
        };
      };
    },
    showPb: function(i) {
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
  filters: {
    timing(time) {
      return getTimeElapsedSinceGettingTask(time);
    },
  },
};
</script>

<style scoped>
hr {
  margin: auto;
  width: 90%;
}
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
