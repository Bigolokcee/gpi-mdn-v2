<template>
  <div>
    <div class="headerHistorique">
        <h1>Historiques</h1>
        <div class="recherche">
            <i class="fas fa-search iconSearch"></i>
            <input type="search" name="" placeholder="Recherche dans l'historique" id="">
        </div>
    </div>

    <!--  <div>
          <p v-for = "h in historiques" :key="h._id"> 
              <ul>
                  <li v-if = "h.entity == 'Direction' && h.action == 'Creation'"> 
                       {{h.user }} a ajouté une direction : <b> {{h.cible}} </b>
                  </li>
                   <li v-if = "h.cible == 'Categorie' && h.action == 'Creation'"> 
                       {{h.user }} a ajouté une nouvelle catégorie : <b> {{h.cible}} </b>
                  </li>
                   <li v-if = "h.cible == 'Fonction' && h.action == 'Creation'"> 
                       {{h.user }} a ajouté une nouvelle fonction: <b> {{h.cible}} </b>
                  </li>
              </ul>
          </p>
    
      </div> -->
        <div class="containerHistorique" v-for="(historiqueD, i) of setOfHistory" :key="i">
            
            <p class="containerDate">
                <span v-if = " historiqueD.d === currentDate ">
                    {{ currentDate }}
                </span>
                <span v-else>
                    {{ historiqueD.d }}
                </span>
            </p>
            <hr>
             <p class="containerAction" v-for="(histo, i) of historiqueD.historique" :key="i">
                
                {{ histo }}
                <ul>
                    <li>
                        <div>
                            <span class="checkbox"><input type="checkbox" name="" id=""></span>
                            <span class="hours">{{histo.createdAt | getHours}}</span>
                        </div>
                        <div class="action">
                        <p>
                                <span v-if = "histo.entity == 'Direction' && histo.action == 'Creation'"> 
                                    {{histo.user }} a ajouté une direction : <b> {{histo.cible}} </b>
                                </span>
                                <span v-if = "histo.cible == 'Categorie' && histo.action == 'Creation'"> 
                                    {{histo.user }} a ajouté une nouvelle catégorie : <b> {{histo.cible}} </b>
                                </span>
                                <span v-if = "histo.cible == 'Fonction' && histo.action == 'Creation'"> 
                                    {{histo.user }} a ajouté une nouvelle fonction: <b> {{histo.cible}} </b>
                                </span>
                        </p>
                        </div>

                    </li> 
                </ul>
          </p>
        </div>



        <div class="containerHistorique">
            <p class="containerDate">
                Lundi 19 Septembre 2021
            </p>
            <hr>
            <p class="containerAction">
                <ul>
                    <li>
                        <div>
                            <span class="checkbox"><input type="checkbox" name="" id=""></span>
                            <span class="hours">03:22</span>
                        </div>
                        <div class="action">
                            Vérifation de l'interface du super admin
                        </div>
                    </li>
                    <li>
                        <div>
                            <span class="checkbox"><input type="checkbox" name="" id=""></span>
                            <span class="hours">04:05</span>
                        </div>
                        <div class="action">
                            Formulaire de confirmation 
                        </div>
                    </li>
                </ul>
            </p>
        </div>
  </div>
</template>

<script>
import { load } from '../../services/functions';
import moment from 'moment'

moment.locale("fr");
export default {
    data(){
        return {
            historiques: [],
            currentDate: "",
            setOfHistory: [],
        }
    },
    methods:{
        getCurrentDate() {
            this.currentDate = moment().format("dddd LL");
            //this.currentDate = moment().calendar("[Aujourd'hui] - dddd LL");
            
        },
        async loadHistoriques(){
            
           
            /* var sameMoment = new Map();
            var allDate = ""
            for (const h of historiques) {
                if ( allDate.indexOf(h.createdAt) === -1 ){
                    allDate.push(h) 
                }
            } */
        },
        async getHistoriqueByDate() {
            const result = await load('historiques');
            this.historiques = result.data;

            //var histoDateAssociated = Object.create(null);
        /*     var h = this.historiques.map(s => {
                var date = moment(s.createdAt).format("LL")
                var time = moment(s.createdAt).format("HH:mm:ss ");
                
                histoDateAssociated.entity = h.entity;
                histoDateAssociated.action = h.action;
                histoDateAssociated.user = h.user;
                histoDateAssociated.cible = h.cible;
                histoDateAssociated.dateTime = [date, time]
                return [histoDateAssociated];
            });
            
           console.log(h[this.historiques.length - 1]) */

            var lastH = this.historiques[this.historiques.length - 1];
            var lastLast = this.historiques[this.historiques.length - 2]

            this.historiques = [lastH,lastLast]

            const setOfHistoriquesDate = new Set();

             //for( var histo of this.historiques ) {
               // if ( moment(histo.createdAt).format("dddd LL") )
                   // setOfHistoriquesDate.add(histo.createdAt)
                //var previous = histo.createdAt;
           // } 

                var previous = null;
            for (let index = 0; index < this.historiques.length; index++) {
                const histo = this.historiques[index];
                console.log(index)
                if ( index == 0 ) {
                     setOfHistoriquesDate.add(histo.createdAt);
                     previous = histo.createdAt;
                }
                else {
                    console.log("object")
                    console.log(moment(previous).format("dddd LL HH:mm"), moment(histo.createdAt).format("dddd LL HH:mm"))
                    if ( moment(previous).format("dddd LL HH:mm") === moment(histo.createdAt).format("dddd LL HH:mm") ){
                        setOfHistoriquesDate.add(histo.createdAt);
                        previous = histo.createdAt
                    }
                }
                
            }
            //console.log(setOfHistoryDate)

            console.log(setOfHistoriquesDate)

            function mergeHistoriqueByDay(setOfHistoriquesDate,historiques) {
                var match = {};

                for( var h of historiques) {
                    console.log(h.createdAt)
                var cd = moment(h.createdAt).format("dddd LL");
                for( var  date of setOfHistoriquesDate) {
                    if ( moment(date).format("dddd LL") === cd ) {
                         if (match[cd] === undefined ) {
                             match[cd] = {d: cd, historique: [h]}
                             //console.log(match[cd])
                             //this.setOfH.push(match[cd])   
                         } else {
                             //match[cd][0].historique.push(h)
                             match[cd].historique.push(h);
                             //this.setOfH.push(match[cd])
                         }
                    }
                 }
                }
                return match;
            }
            
           // this.setOfH = match;

           var histories =  Object.entries(mergeHistoriqueByDay(setOfHistoriquesDate, this.historiques));
           console.log(histories)
           this.setOfHistory = histories.map( h => h[1])
           //
           //console.log(this.setOfHistory[0].historique)
           //this.setOfHistory[0].historique.forEach(element => {
               /* console.log(element.createdAt, moment(element.createdAt).format("HH:mm"), element.action, element.cible) */
             //  console.log(element)
           //});
        }

    },
    filters: {
        getHours(date) {
            //var dateUTCPlus1 = new Date().toISOString();
            var correctDateTime = date.substr(0, date.length - 1)

            return moment(correctDateTime).format("HH:mm");
                
        }
    },
    mounted(){
        this.getHistoriqueByDate();
        this.getCurrentDate();

    }
}
</script>

<style scoped>
.headerHistorique
{
   display: flex;
   justify-content: space-between;
   margin-top: 10px;
   background-color: #007315;
   padding: 10px;
}
.recherche
{
    width: 55%;
    display: flex;
    padding: 5px;
    background-color: rgb(37, 146, 37);
}
.recherche input
{
    width: 100%;
    outline: none;
    border:none;
     
}
.iconSearch
{
    color:white;
    padding: 8px;
}
h1
{
    color: white;
}
.containerHistorique
{
    margin: auto;
    width: 80%;
    padding: 20px;
}
.containerDate
{
    background-color: whitesmoke;
    padding: 20px;
    font-size: 20px;
    box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
    -webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
    -moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
}
.containerAction
{
    background-color: whitesmoke;
    padding: 15px;
    box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
    -webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
    -moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.2);
}
.containerAction ul
{
    list-style: none;    
}
.containerAction li
{
    align-items: center;
    display: flex;
    min-height: var(--item-height);
    padding-inline-start: 10px;
    pointer-events: auto;
    margin-bottom: 25px;
    
}
.action
{
    align-items: center;
    display: flex;
    flex: 1;
    height: var(--item-height);
    overflow: hidden;
    padding-inline-start: 50px;
}
.hours
{ 
    margin-inline-start: 15px;
    min-width: 96px;
}
</style>