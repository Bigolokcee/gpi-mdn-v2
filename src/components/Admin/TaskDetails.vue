<template>
  <div>
    <button style="margin-left: 20px" @click="goBack">Retour</button>
    <div class="" v-if="!loading">
      <section id="app" class="section container">
        <article class="message">
          <div class="containerInfoProblem">
            <div class="deskAndTime">
              <div class="desk">
                <h4 style="font-weight: 200; font-size: 15px">
                  <i class="fa fa-map-marker"></i>
                  {{ p.sender.fonction }} -
                  {{ p.sender.direction.code }}
                </h4>
              </div>
              <div class="Time">
                <i class="fa fa-clock"></i
                >{{ new Date(p.sender.createdAt).toLocaleString() }}
              </div>
            </div>

            <div class="nameAndDate">
              <div class="name">
                <h5 v-if="p.sender != null">
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

          <!-- <div class="message-header" @click="showPb(index)">
            Voir le Problème
          </div> -->
          <div class="message-body">
            <div class="problem">
              <!-- <li v-if="(user.statut == 'administrateur' && user.fonction == 'Help/Desk')">
                <span class="titleLi">ASSIGNER A </span>
                <p v-if="p.assignedTo != null" style="margin-top: 10px">
                  {{ p.assignedTo.prenom }} {{ p.assignedTo.nom }}
                </p>
                <p v-else style="margin-top: 10px">
                  <select name="" id="" @change="select" class="selectMateriel">
                    <option value="">Selectionner un chef division</option>
                    <option v-for="c in chefDivisions" :key="c._id" :value="c._id">
                      {{ c.nom }} {{ c.prenom }}
                    </option>
                  </select>
                  <button class="button" @click="assign(p)">
                    ASSIGNER LA TACHE
                  </button>
                </p>
              </li> -->
              <li>
                <span class="titleLi">EXECUTER PAR </span>
                <p v-if="p.executeBy != null" style="margin-top: 10px">
                  {{ p.executeBy.prenom }} {{ p.executeBy.nom }}
                </p>
                <p v-else style="margin-top: 10px">
                  <select name="" id="" @change="select" class="selectMateriel">
                    <option value="">Selectionner un technicien</option>
                    <option v-for="c in technicien" :key="c._id" :value="c._id">
                      {{ c.nom }} {{ c.prenom }}
                    </option>
                  </select>
                  <button class="button" @click="assign(p)">
                    ASSIGNER LA TACHE
                  </button>
                </p>
              </li>
              <li>
                <span class="titleLi">MATERIEL CONCERNE </span><br />
                <p>{{ p.materiel[0].libelle }}</p>
              </li>
              <li>
                <span class="titleLi">DESCRIPTION DU PROBLEME</span><br />
                <p>{{ p.description }}</p>
              </li>
              <li
                v-if="
                  p.piece[0]
                "
              >
                <span class="titleLi">Piece de rechange demandé</span><br />
                <p>{{ p.piece[0].libelle }}</p>
              </li>
              <li
                v-else
              >
                <span class="titleLi">Piece de rechange demandé</span><br />
                <p>Aucune pièce demander</p>
              </li>
              <li >
                <span class="titleLi">SOLUTIONS PRECONISEES : </span>
                <p >
                  <!-- <ul
                    v-for="(solution, index) in p.solutionPreconise"
                    :key="index"
                  >
                    <li class="listSolutions">{{ solution }}</li>
                  </ul> -->
                  <span> {{p.solutionPreconise ? p.solutionPreconise[0] : "Pas encore de solution"}} </span>
                </p>
              </li>
              <li v-if="p.isProgress == 'false'">
                <span>Date de fin : </span>
                <p>{{ p.endAt }}</p>
              </li>
              <li
                v-if="
                  p.solutionPreconise &&
                  p.solutionPreconise.length % 2 != 0 &&
                  p.statut == 'false' &&
                  user.statut != 'administrateur'
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
    <div v-else>Chargement...</div>
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
import { load, update } from '../../services/functions';
import { getCurrentSessionUser } from '../../services/storage';

  export default {
    data() {
      return {

        chefDivisions: [],
        user: getCurrentSessionUser(),
        selected : null,
        p: {},
        loading: true,
        technicien : []
      };
    },
    async mounted() {
      this.loading = true;
      await this.getProbleme();
      this.loading = false;
      this.loadChefDivisions();
      console.log(this.p);
      this.loadTechnicien()
    },
    methods: {


      async loadTechnicien() {
        // const c = await load("users?tutelle="+this.tutelleId+"&statut=chefDivision");
        const c = await load('users/all?statut=technicien');
        console.log(c.data);
        this.technicien = c.data;
      },

      async loadChefDivisions() {
        // const c = await load("users?tutelle="+this.tutelleId+"&statut=chefDivision");
        const c = await load('users/all?statut=chefDivision');
        this.chefDivisions = c.data;
      },
      async assign(p) {
        p.assignedTo = this.selected;
        // p.createdAt.push(new Date().toISOString());

        await update('probleme/' + p._id, {
          // assignedTo: p.assignedTo,
          executeBy: p.assignedTo,
          createdAt: p.createdAt,
          statut : 'en-cours-2'
        });

        //displayMessage("T-Ass");
        Swal.fire('Assignée', 'La tâche a été assigné avec succès', 'success');
        this.getProbleme();
        // this.socket.send(JSON.stringify(p));
      },
      select(e) {
        this.selected = e.target.value;
      },
      async getProbleme() {
        // console.log(this.$route.params);
        const res = await load('probleme/' + this.$route.params.id);
        console.log(res.data);
        this.p = res.data;
      },

      goBack() {
        this.$router.back();
      },
    },
  };
</script>

<style scoped>
  .message-body{
    height: auto;
    max-height: fit-content !important;
    overflow: auto;
    background-color: transparent
  }

  .message{
    border: none;
  }
</style>