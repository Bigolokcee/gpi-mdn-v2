<template>
  <div>
    <div class="container-tiket">
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
                <h4 style="font-weight: 200; font-size: 15px">
                  <i class="fa fa-map-marker"></i>{{ p.sender.fonction }} -
                  {{ p.sender.direction }}
                </h4>
              </div>
              <div class="Time">
                <i class="fa fa-clock"></i>il ya 24 minutes
              </div>
            </div>

            <div class="nameAndDate">
              <div class="name">
                <h5>{{ p.sender.nom }} - {{ p.sender.prenom }}</h5>
              </div>
              <div>
                <i v-if="p.statut == 'true'" class="fas fa-sync"> En cours</i>
                <i v-else class="fas fa-sync"> En attente</i>
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
                <p style="margin-top: 10px">
                  {{ p.executeBy.prenom }} {{ p.executeBy.nom }}
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
              <li v-if="p.materiel.length == 2">
                <span class="titleLi">MATERIEL DEMANDE</span><br />
                <p>{{ p.materiel[1].libelle }}</p>
              </li>
              <li v-else>
                <span class="titleLi">MATERIEL DEMANDE </span>
                <p>Non renseigné</p>
              </li>
              <li>
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
                <p v-else>Aucune solution n'a encore été préconisée</p>
              </li>
              <li v-if="p.solutionPreconise.length % 2 != 0">
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
  import { _SERVER_URL } from '../../services/environment';
  //import { getCurrentSessionUser } from '../../services/storage';
  var moment = require('moment');

  export default {
    name: 'Ticket',
    data() {},
    methods: {
      props: {
        problems: [Object],
      },

      async sendDiagnostique(p) {
        console.log(p);
        var sp = document.querySelector('.sp').value;
        if (sp === '') {
          alert('Veuillez remplir tous les champs');
        } else {
          p.solutionPreconise.push(sp);
          const res = await fetch(_SERVER_URL + 'probleme/' + p._id, {
            method: 'PUT',
            body: JSON.stringify({ solutionPreconise: p.solutionPreconise }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((r) => r.json());

          if (res.status === 201) {
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
        console.log(this.sortedBy);
        //return this.sortedBy === "all" ? this.problems : this.problems.filter( problem => problem.statut === this.sortedBy);
      },
      async approuve(p) {
        /*
        Change le statut du materiel demandé en "Preté" et autorise le pret

      */
        let materielDemande = p.materiel[1]._id;
        let id = p._id;
        await fetch(_SERVER_URL + 'materiels/' + materielDemande, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Indisponible' }),
          headers: {
            'Content-type': 'application/json',
          },
        }).then((r) => r.json());
        var statut = 'true';
        var message = await fetch(_SERVER_URL + 'probleme/' + id, {
          method: 'PUT',
          body: JSON.stringify({ statut }),
          headers: {
            'Content-type': 'application/json',
          },
        }).then((r) => r.json());

        this.approved = true;
        console.log(_SERVER_URL + 'probleme/' + id);
        console.log(message);
      },
      showPb: function (i) {
        this.isOpen[i] = !this.isOpen[i];
        this.isOpen = [...this.isOpen];
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
    mounted() {
      this.loadProblemAssignedToTech();
      this.sendDiagnostique();
    },
    filters: {
      dateElapsed: function (value) {
        // console.log(value)
        var now = moment(new Date()); //todays date
        var date = value.split('T')[0];
        var end = moment(date); // another date
        //var duration = moment.duration(now.diff(end));
        moment().startOf().fromNow();
        //var days = duration.asDays();
        var duration = moment.duration(now.diff(end));
        var days = duration._data.days;
        var hours = duration._data.hours;
        var minutes = duration._data.minutes;
        var months = duration._data.months;
        var years = duration._data.years;
        var seconds = duration._data.seconds;
        //var milliseconds = duration._data.milliseconds;
        //var pluriel = 's';
        //console.log(seconds, days, minutes, hours, days, months, years)

        if (years != 0) {
          return years == 1 || months == 1
            ? `il y a ${months} année ${months} mois`
            : `il y a ${years} années ${months} mois`;
        } else if (years == 0 && months != 0) {
          return days > 1
            ? `il y a ${months} mois ${days} jours`
            : `il y a ${months} mois ${days} jour`;
        } else if (years == 0 && months == 0 && days != 0) {
          return days > 1
            ? `il y a ${days} jours ${minutes} min`
            : `il y a ${months} mois ${days} jour`;
        } else if (years == 0 && months == 0 && days == 0 && hours != 0) {
          return hours == 1
            ? `il y a ${hours} heure ${minutes} min`
            : `il y a ${hours} heures ${minutes} min`;
        } else if (
          years == 0 &&
          months == 0 &&
          days == 0 &&
          hours == 0 &&
          minutes != 0
        ) {
          return `il y a ${minutes} min ${seconds} s`;
        } else if (
          years == 0 &&
          months == 0 &&
          days == 0 &&
          minutes == 0 &&
          seconds != 0
        ) {
          return `il y a ${seconds}s  `;
        }
      },
      timeOfReception(value) {
        var time = value
          .split('T')[1]
          .slice(0, value.split('T')[1].length - 1)
          .split(':');
        var heure = time[0];
        var min = time[1];
        return heure + 'h' + min + 'min';
      },
    },
  };
</script>

<style scoped>
  .headertask {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .nbrTask {
    margin-top: 10px;
    margin-right: 50px;
    font-size: 25px;
  }
  .emptyTache {
    position: absolute;
    top: 40%;
    left: 10%;
    font-size: 35px;
  }
  .button {
    padding: 5px;
    border-radius: 5px;
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
