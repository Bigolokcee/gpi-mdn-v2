<template>
  <div>
    <button style="margin-left: 20px" @click="goBack">Retour</button>
    <div class="" v-if="!loading">
      <!-- <section id="app" class="section container">
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
                <p v-if="p.executeBy != 'null'" style="margin-top: 10px">
                  {{ p.executeBy.prenom }} {{ p.executeBy.nom }}
                </p>
                <p v-else style="margin-top: 10px">Pas encore assigné</p>
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
                  p.materiel && p.materiel.length == 2 && p.statut == 'false'
                "
              >
                <span class="titleLi">MATERIEL DEMANDE</span><br />
                <p>{{ p.materiel[1].libelle }}</p>
              </li>
              <li v-else>
                <span class="titleLi">MATERIEL DEMANDE </span>
                <p>L'intervention ne requiert pas un nouveau matériel</p>
              </li>
              <li v-if="userStatut != 'administrateur'">
                <span class="titleLi">SOLUTIONS PRECONISEES : </span>
                <span
                  v-if="p.solutionPreconise && p.solutionPreconise.length != 0"
                >
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
                <p v-else>Aucune solution n'a encore été préconisée</p>
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
                  userStatut != 'administrateur'
                "
              >
                <button @click="approuve(p)" class="button">
                  APPROUVER LA SOLUTION
                </button>
              </li>
            </div>
          </div>
        </article>
      </section> -->
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
              <li v-if="userStatut == 'administrateur'">
                <span class="titleLi">ASSIGNE A </span>
                <p v-if="p.assignedTo != null" style="margin-top: 10px">
                  {{ p.assignedTo.prenom }} {{ p.assignedTo.nom }}
                </p>
                <p v-else style="margin-top: 10px">
                  <span class="titleLi">ASSIGNER A </span>
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
              </li>
              <li>
                <span class="titleLi">EXECUTER PAR </span>
                <p v-if="p.executeBy != null" style="margin-top: 10px">
                  {{ p.executeBy.prenom }} {{ p.executeBy.nom }}
                </p>
                <p v-else style="margin-top: 10px">Pas encore assigné</p>
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
                  p.materiel && p.materiel.length == 2 && p.statut == 'false'
                "
              >
                <span class="titleLi">MATERIEL DEMANDE</span><br />
                <p>{{ p.materiel[1].libelle }}</p>
              </li>
              <li v-else>
                <span class="titleLi">MATERIEL DEMANDE </span>
                <p>L'intervention ne requiert pas un nouveau matériel</p>
              </li>
              <li v-if="userStatut != 'administrateur'">
                <span class="titleLi">SOLUTIONS PRECONISEES : </span>
                <p
                  v-if="p.solutionPreconise && p.solutionPreconise.length != 0 && userStatut != 'technicien'"
                >
                  {{p.solutionPreconise}}
                </p>
                <span v-else-if="userStatut == 'technicien'">
                  <!-- <ul
                    v-for="(solution, index) in p.solutionPreconise"
                    :key="index"
                  >
                    <li class="listSolutions">{{ solution }}</li>
                  </ul> -->
                  <textarea
                    v-if="
                      p.solutionPreconise && p.solutionPreconise.length % 2 != 0 && p.statut == 'false'
                    "
                    rows="1"
                    type="text"
                    class="textarea sp"
                    placeholder="ENTRER LA SOLUTION PRECONISEE"
                  >
                  </textarea>
                  <textarea
                    v-else
                    rows="1"
                    type="text"
                    class="textarea sp"
                    placeholder="ENTRER LA SOLUTION PRECONISEE"
                  >
                  </textarea>

                  <div>
                    <button
                      v-if="userStatut=='technicien'"
                      class="button"
                      @click="sendDiagnostique(p)"
                    >
                      Envoyer Le Diagnostique
                    </button>
                  </div>
                </span>
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
                  userStatut != 'administrateur'
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
  import { load } from '../../services/functions';
import { getCurrentSessionUser } from '../../services/storage';

  export default {
    data() {
      return {
        p: {},
        userStatut: getCurrentSessionUser().statut,
        loading: true,
      };
    },
    async mounted() {
      this.loading = true;
      await this.getProbleme();
      this.loading = false;
      console.log(this.p);
    },
    methods: {
      async getProbleme() {
        console.log(this.$route.params);
        const res = await load('probleme/' + this.$route.params.id);
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