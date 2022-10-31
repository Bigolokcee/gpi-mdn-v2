<template>
  <div>
    <!-- entete de direction -->
    <div>
      <SubHeader
        entity="Structure"
        isForProblems="no"
        nbrOfTask="2"
        needSearchBar="yes"
        :form="directionForm"
        :data="directions"
        @showForm="showForm = true"
        @filter="filterData"
        :isSubHeaderActive="isSubHeaderActive"
        :selected="nbrOfTaskSelected"
        :arrayCheckbox="selectedCheckbox"
        @change="sorting"
        @sortByRadio="sortByRadio"
        :options="options"
        @selectedTutelle="selectedTutelle"
        @sortInAlphabeticOrder="sortInAlphabeticOrder"
      />
    </div>
    <Loader :data="directions" />
    <!-- body direction -->
    <div class="containerDirection">
      <!-- ajouter une direction -->
      <div id="showForm" class="modal-vue">
        <!--  <button @click="showForm = true" class="directionAddButton">+</button> -->
        <div class="overlay" v-if="showForm" @click="showForm = false"></div>

        <form v-if="showForm" @submit="createDirection" class="formDirection">
          <button class="close" @click="showForm = false">x</button>
          <h1 class="h1">AJOUTER UNE STRUCTURE</h1>
          <p>
            <input
              type="text"
              v-model="direction.code"
              placeholder="Code de la structure"
              class="codeDirectionInput"
            />
          </p>
          <p>
            <input
              type="text"
              v-model="direction.libelle"
              placeholder="Designation de la structure"
              class="designationDirectionInput"
            />
          </p>

          <!--  <p>
            <select
              class="selectMateriel"
              id=""
              v-model="direction.tutelle"
            >
            <option value="">Selectionner une tutelle</option>
             <option v-for="t in tutelles.data" :key="t._id" :value="t._id">{{
                t.libelle
              }}</option>
            </select>
          </p> -->
          <button class="button">Ajouter une structure</button>
        </form>
      </div>

      <!-- modifier une direction -->
      <div id="modifyDirection" class="modal-vue">
        <div
          class="overlay"
          v-if="modifyDirection"
          @click="modifyDirection = false"
        ></div>

        <form v-if="modifyDirection" class="formDirection">
          <button class="close" @click="modifyDirection = false">x</button>
          <h1 class="h1">MODIFIER UNE STRUCTURE</h1>
          <p>
            <label for="" style="float: left"
              >Modifier le code de la structure</label
            >
            <input
              type="text"
              v-model="oldDirection.code"
              class="codeDirectionInput"
            />
          </p>
          <p>
            <label for="" style="float: left"
              >Modifier la désignation de la structure</label
            >
            <input
              type="text"
              v-model="oldDirection.libelle"
              class="designationDirectionInput"
            />
          </p>
          <!--  <p>
            <label for="" style="float:left;"
              >Modifier la désignation de la tutelle</label
            >
            <input
              type="text"
              v-model="oldDirection.tutelle"
              class="designationDirectionInput"
            />
          </p> -->

          <button class="button" @click="updateDirection">
            Modifier une structure
          </button>
        </form>
      </div>

      <!-- liste des directions -->
      <table>
        <tr>
          <th>
            <input
              type="checkbox"
              ref="checkboxForSelectAllField"
              @click="selectAll($event)"
            />
          </th>
          <th>CODE</th>
          <th>DESIGNATION</th>
          <th v-if="userStatut == 'root'">TUTELLE</th>
          <th v-if="userStatut != 'root'">ACTIONS</th>
        </tr>
        <!-- @click="gotoBureaux(d._id)" -->
        <tr v-for="d in filteredList" :key="d.code">
          <td>
            <input
              type="checkbox"
              @click="selectCheckbox($event)"
              name=""
              id=""
            />
            <input type="hidden" :value="d._id" name="" />
          </td>
          <td class="code">{{ d.code }}</td>
          <td>{{ d.libelle }}</td>
          <td v-if="userStatut == 'root'">{{ d.tutelle.libelle }}</td>
          <td v-if="userStatut != 'root'">
            <button
              @click="showModalUpdate(d)"
              class="faEdit fas fa-edit"
            ></button>
            <button
              @click="showConfirmDelete(d._id)"
              class="faTrash fas fa-trash-alt"
            ></button>
          </td>
        </tr>
      </table>

      <!-- CONFIRMER LA SUPPRESSION -->
      <div id="deleteDirection" class="modal-vue">
        <div
          class="overlay"
          v-if="deleteDirection"
          @click="deleteDirection = false"
        ></div>

        <form
          v-if="deleteDirection"
          @submit="createDirection"
          class="formDirection"
        >
          <button class="close" @click="deleteDirection = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">Êtes-vous sûr de vouloir supprimer cette structure ?</p>
          </div>
          <div>
            <button @click="deleteD" class="delete">
              Supprimer une structure
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  //import { _SERVER_URL } from "../../services/environment";
  import { getCurrentSessionUser } from '../../services/storage';
  import SubHeader from '../General/SubHeader.vue';
  import {
    load,
    post,
    update,
    toDelete,
    displayMessage,
    isAdmin,
    alphabeticSort,
    changeTitle,
  } from '../../services/functions';
  import Loader from '../General/Loader.vue';
  export default {
    components: {
      SubHeader,
      Loader,
    },
    name: 'Structure',
    data: function () {
      return {
        loading: true,
        connectedUser: getCurrentSessionUser().username,
        nbrOfTaskSelected: 0,
        selectedObject: this.nbrOfTaskSelected,
        directionForm: {
          placeholder: 'Rechercher une structure',
          plusIconeTitle: 'Ajouter Une Structure',
          class: {
            search: 'fa fa-search',
            plus: 'fa fa-plus-square faPlus',
          },
        },

        tutelles: [],
        tutelle: '',
        isSubHeaderActive: false,
        openForm: false,
        search: '',
        direction: {
          code: '',
          libelle: '',
        },
        user: getCurrentSessionUser(),
        oldDirection: {
          code: '',
          libelle: '',
        },
        options: [
          {
            label: 'Code',
            value: 'code',
          },
          {
            label: 'Designation',
            value: 'libelle',
          },
        ],
        defaultLabel: 'Trier selon une tutelle',
        directions: [],
        showForm: false,
        modifyDirection: false,
        deleteDirection: false,
        currentDirection: '',
        currentCategorieId: '',
        DIRECTIONS: [],
        filteredP: this.directions,
        selectedCheckbox: [],
        filteredList: [],
        userStatut: getCurrentSessionUser().statut,
        currentTutelleValue: '',
        selectFilteredList: [],
        filterValue: '',
      };
    },
    methods: {
      sorting(value) {
        alert(value);
      },
      sortInAlphabeticOrder(value) {
        this.selectFilteredList = this.directions;
        this.filteredList = alphabeticSort(this.directions, value);
      },
      sortByRadio(value) {
        this.filteredList = this.selectFilteredList.sort((a, b) => {
          return ('' + a[value]).localeCompare(b[value]);
        });
      },
      selectedTutelle(value) {
        this.currentTutelleValue = value;
        this.filteredList = this.directions;

        if (value != '') {
          this.filteredList = this.filteredList.filter(
            (f) =>
              f.tutelle._id === value &&
              (f.libelle
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()) ||
                f.code
                  .toLowerCase()
                  .trim()
                  .includes(this.filterValue.toLowerCase().trim())) &&
              f.tutelle._id.includes(this.currentTutelleValue)
          );
        } else {
          this.filteredList = this.directions;
        }
      },
      filterData(value) {
        this.filterValue = value;
        this.filteredList = this.directions;
        this.filteredList = this.filteredList.filter((direction) => {
          console.log(direction);
          return (
            direction.libelle
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            direction.code
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim())
          );
        });
      },
      createDirection: async function (event) {
        event.preventDefault();

        // this.direction.tutelle = getCurrentSessionUser().tutelle;
        const result = await post('directions', this.direction);

        if (result.status === 201) {
          //Save historique

          // var identity = this.user.nom + " " + this.user.prenom;
          // await post("historiques", {
          //   action: "Creation",
          //   user: identity,
          //   entity: "Direction",
          //   cible: this.direction.libelle,
          // });

          displayMessage('D-Cr');
          this.loadData();
        }
        this.direction = { code: '', libelle: '' };
      },
      selectAll($event) {
        var checkboxes = document.querySelectorAll(
          "table input[type = 'checkbox']"
        );
        var hiddenInputArray = document.querySelectorAll(
          "table input[type = 'hidden']"
        );
        if ($event.target.checked) {
          for (var checkbox of checkboxes) {
            checkbox.checked = true;
            this.isSubHeaderActive = true;
            this.nbrOfTaskSelected = checkboxes.length - 1;
          }
          for (var hiddenInput of hiddenInputArray) {
            this.selectedCheckbox.push(hiddenInput.value);
          }
        } else {
          for (checkbox of checkboxes) {
            checkbox.checked = false;
            this.isSubHeaderActive = false;
            this.nbrOfTaskSelected = 0;
            this.selectedCheckbox = [];
          }
        }
      },
      disableCheckboxForSelectAllField() {
        if (this.directions == 0) {
          this.$refs.checkboxForSelectAllField.disabled = true;
        } else {
          this.$refs.checkboxForSelectAllField.disabled = false;
          this.$refs.checkboxForSelectAllField.checked = false;
        }
      },
      selectCheckbox($event) {
        //Recupere les informations sur l'évènement
        var checkbox = $event;

        //Recupere l'Id de l'element selectionné grace à l'input type hidden
        var currentElementId = $event.path[2].children[0].children[1].value;

        //Contient l'input permettant de selectionner/deselectionner tous les checkbooox
        var checkboxForSelectAllField = this.$refs.checkboxForSelectAllField;

        var checkboxes = document.querySelectorAll(
          "table input[type = 'checkbox']"
        );

        if (checkbox.target.checked) {
          //Incremente le nombre d'elements sélectionés
          this.nbrOfTaskSelected++;

          //Affiche la sous entete
          this.isSubHeaderActive = true;

          //AJoute l'élémént au tableau contenant tous les éléménts sélectionnés
          this.selectedCheckbox.push(currentElementId);

          if (this.nbrOfTaskSelected === checkboxes.length - 1) {
            checkboxForSelectAllField.checked = true;
          }
        } else if (!checkbox.target.checked) {
          //Décrémente le nombre d'elements sélectionés
          this.nbrOfTaskSelected--;

          //Verifie si le checkbox selectionner/deselectionner  tous les éléments est actif
          if (checkboxForSelectAllField.checked === true) {
            checkboxForSelectAllField.checked = false;
          }
          //Retire l'élément séléctionné du tableau
          this.selectedCheckbox = this.selectedCheckbox.filter(
            (selectedId) => selectedId != currentElementId
          );

          //Cache la sous entete si il n'y a plus d'éléments séléctionné
          if (this.nbrOfTaskSelected == 0) {
            this.isSubHeaderActive = false;
          }
        }
      },
      unSelect() {
        //Recupere tous les checkbox contenu dans un tableau
        var checkboxes = document.querySelectorAll(
          "table input[type = 'checkbox']"
        );

        //Désélectionne tous les éléménts
        for (var checkbox of checkboxes) {
          checkbox.checked = false;
        }
        this.isSubHeaderActive = false;
        this.nbrOfTaskSelected = 0;
      },
      async deleteSelectedElement() {
        var permission = await isAdmin(this.connectedUser);
        if (permission.status == 200) {
          var result;
          for (var checkbox of this.selectedCheckbox) {
            result = await toDelete('directions/' + checkbox);
          }
          if (result.status == 201) {
            displayMessage('D-Del');
            this.loadData();
            this.nbrOfTaskSelected = 0;
            this.isSubHeaderActive = false;
          }
        } else {
          displayMessage('D-Auth');
        }
      },

      async loadData() {
        if (this.userStatut === 'root') {
          var tutelleId = getCurrentSessionUser().tutelle;
          const result = await load('directions/all?tutelleId=' + tutelleId);
          this.directions = result.data;
          this.filteredList = this.directions;
          this.selectFilteredList = this.directions;
          this.tutelles = await load('tutelles');
        } else {
          tutelleId = getCurrentSessionUser().tutelle;
          const result = await load('directions/all');
          this.directions = result.data;
          this.selectFilteredList = this.directions;
          this.filteredList = this.directions;
          // this.tutelles = await load('tutelles');
        }
        this.disableCheckboxForSelectAllField();
      },
      async deleteD() {
        var permission = await isAdmin(this.connectedUser);
        if (permission.status == 200) {
          var result = await toDelete("directions/" + this.currentDirection);
          // var result = await toDelete('directions/all');
          if (result.status == 201) {
            displayMessage('D-Del');
            this.loadData();
            this.deleteDirection = false;
          }
        } else {
          displayMessage('D-Auth');
        }
      },
      showConfirmDelete(currentDirectionId) {
        (this.deleteDirection = true),
          (this.currentDirection = currentDirectionId);
      },
      showModalUpdate(d) {
        this.modifyDirection = true;
        this.oldDirection.code = d.code;
        this.oldDirection.libelle = d.libelle;
        // this.oldDirection.tutelle = getCurrentSessionUser().tutelle;
        this.currentDirectionId = d._id;
      },
      filtered() {
        this.filteredP = this.directions.filter(
          (direction) =>
            direction.libelle.includes(this.search) ||
            direction.code.includes(this.search)
        );
        return this.filteredP;
      },
      async updateDirection(event) {
        event.preventDefault();
        var code = this.oldDirection.code;
        var libelle = this.oldDirection.libelle;
        // var tutelle = this.oldDirection.tutelle;
        try {
          this.newValue = this.oldLibelle;
          var ok = await update('directions/' + this.currentDirectionId, {
            code,
            libelle,
          });

          if (ok.status == 201) {
            displayMessage('D-Upd');
            this.loadData();
          }
        } catch (e) {
          //Nothing to do
        }
      },
    },

    computed: {},
    mounted: function () {
      this.loadData();
      this.disableCheckboxForSelectAllField();
      changeTitle(this.$route.name);
    },
  };
</script>

<style scoped>
  table {
    border-collapse: collapse;
    margin: auto;
  }
  th {
    font-size: 17px;
  }
  th,
  td {
    text-align: left;
    padding: 20px;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  .faEdit {
    color: blue;
  }
  .faTrash {
    color: red;
    margin-left: 3%;
  }
  .containerDirection {
    width: 100%;
    margin: 0 auto;
  }

  /*partie ajout - modification*/
  /* .directionAddButton
{
  float: left;
  position: relative;
  top: 10px; 
  left: 25px;
  width: 10%;
  background-color: rgb(22, 133, 38);
  border-bottom:5px solid rgb(13, 80, 23);
  border-radius: 7px;
  font-size: 20px;
  color:whitesmoke;
  transition:all 0.5s;
} */
  p {
    margin: 15px;
  }
  .formDirection {
    width: 40%;
    z-index: 9999;
    margin: auto;
    text-align: center;
    padding: 30px 40px;
    background-color: gainsboro;
    border-radius: 5px;
    position: absolute;
    top: 25%;
    left: 35%;
  }
  .h1 {
    font-size: 25px;
  }
  .codeDirectionInput,
  .designationDirectionInput {
    width: 100%;
    border: 2px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 2%;
    border-radius: 5px;
    font-size: 17px;
    margin: auto;
  }
  .button {
    width: 40%;
    float: left;
    border-radius: 5px;
    font-size: 15px;
    padding: 5px;
    transition: all 0.5s;
    margin-left: 3%;
  }
  .modal-vue .overlay {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .close {
    position: absolute;
    top: 2%;
    right: 2%;
    float: right;
    width: 7%;
    color: white;
    background-color: red;
    opacity: 0.7;
    font-size: 20px;
    border: 1px solid red;
    border-radius: 100%;
  }
  .close:hover {
    opacity: 1;
  }
  .code {
    text-transform: uppercase;
  }

  /*------mediaQuery--------*/
  /* @media screen and (max-width: 1000px) 
{
  .addDirection
  {
    width: 25%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 20px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    margin-left: 12%;
    padding: 2px;
  }
  .delete
  {
    width: 25%;
    background-color: red;
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    padding: 2px;
  }
  .formDirection
  {
    width:50%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:35%  
  }
} */
  /* @media screen and (max-width: 900px) 
{
  .formDirection
  {
    width:50%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:25%  
  }
}
@media screen and (max-width: 1000px) 
{
  .addDirection
  {
    width: 25%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 20px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    margin-left: 12%;
    padding: 2px;
  }
  .delete
  {
    width: 25%;
    background-color: red;
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    padding: 2px;
  }
  .formDirection
  {
    width:50%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:35%  
  }
}
@media screen and (max-width: 900px) 
{
  .formDirection
  {
    width:60%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:20%  
  }
}
@media screen and (max-width: 650px) 
{
  .formDirection
  {
    width:70%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:15%  
  }
}
@media screen and (max-width: 650px) 
{
  .formDirection
  {
    width:80%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:15%  
  }
  .codeDirectionInput,.designationDirectionInput
  {
    width: 82%;
    border:1.3px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 1%;
    border-radius: 5px;
    font-size: 20px;
    box-sizing:border-box;
    margin:auto;
    margin-top:4%;
    margin-left: 5%;
  }
  .titleAddDirection
  {
    font-size: 20px;
    margin-left: 15%;
  }
  .addDirection
  {
    width: 25%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 20px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    margin-left: 5%;
    padding: 3px;
  }
}
@media screen and (max-width: 450px) 
{
  .formDirection
  {
    width:85%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:7%  
  }
  .codeDirectionInput,.designationDirectionInput
  {
    width: 82%;
    border:1.3px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 1%;
    border-radius: 5px;
    font-size: 15px;
    box-sizing:border-box;
    margin:auto;
    margin-top:4%;
    margin-left: 2%;
  }
  .titleAddDirection
  {
    font-size: 15px;
    margin-left: 12%;
  }
  .addDirection
  {
    width: 25%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    margin-left: 5%;
    padding: 2px;
  }
}
@media screen and (max-width: 400px) 
{
  .formDirection
  {
    width:85%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:7%  
  }
  .codeDirectionInput,.designationDirectionInput
  {
    width: 90%;
    border:1.3px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 1%;
    border-radius: 5px;
    font-size: 15px;
    box-sizing:border-box;
    margin:auto;
    margin-top:4%;
  }
  .titleAddDirection
  {
    font-size: 15px;
    margin-left: 2%;
  }
  .addDirection
  {
    width: 30%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    margin-left: 2%;
    padding: 1px 2px 1px 2px;
  }
}
@media screen and (max-width: 400px) 
{
  .formDirection
  {
    width:85%;
    z-index: 9999;
    margin: auto;
    padding: 20px 30px;
    background-color: rgba(255, 255, 255, 1); 
    border-radius: 5px;
    position: absolute;
    top:25%;
    left:8%  
  }
  .codeDirectionInput,.designationDirectionInput
  {
    width: 95%;
    border:1.3px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 1%;
    border-radius: 5px;
    font-size: 15px;
    box-sizing:border-box;
    margin:auto;
    margin-top:4%;
  }
  .titleAddDirection
  {
    font-size: 12px;
  }
  .addDirection
  {
    width: 40%;
    background-color: rgb(22, 133, 38);
    border-bottom:5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color:whitesmoke;
    transition:all 0.5s;
    margin-top: 4%;
    padding: 1px 2px 1px 2px;
  }
} */

  .sub-header {
    display: flex;
    flex-direction: row;
  }
  .sub-header button {
    width: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
