<template>
  <div>
    <!-- entete de tutelle -->
    <div>
      <SubHeader
        entity="Tutelle"
        isForProblems="no"
        nbrOfTask="2"
        needSearchBar="yes"
        :form="tutelleForm"
        :data="tutelles"
        @showForm="showForm = true"
        @filter="filterData"
        :isSubHeaderActive="isSubHeaderActive"
        :selected="nbrOfTaskSelected"
        :arrayCheckbox="selectedCheckbox"
      />
    </div>

    <!-- body tutelle -->
    <div class="containerDirection">
      <!-- ajouter une tutelle -->
      <div id="showForm" class="modal-vue">
        <!--  <button @click="showForm = true" class="directionAddButton">+</button> -->
        <div class="overlay" v-if="showForm" @click="showForm = false"></div>

        <form v-if="showForm" @submit="createTutelle" class="formDirection">
          <button class="close" @click="showForm = false">x</button>
          <h1 class="h1">AJOUTER UNE TUTELLE</h1>
          <p>
            <input
              type="text"
              v-model="tutelle.code"
              placeholder="Code de la tutelle"
              class="codeDirectionInput"
            />
          </p>
          <p>
            <input
              type="text"
              v-model="tutelle.libelle"
              placeholder="Designation de la tutelle"
              class="designationDirectionInput"
            />
          </p>
          <button class="button">Ajouter une tutelle</button>
        </form>
      </div>

      <!-- modifier une tutelle -->
      <div id="modifyTutelle" class="modal-vue">
        <div
          class="overlay"
          v-if="modifyTutelle"
          @click="modifyTutelle = false"
        ></div>

        <form v-if="modifyTutelle" class="formDirection">
          <button class="close" @click="modifyTutelle = false">x</button>
          <h1 class="h1">MODIFIER UNE TUTELLE</h1>
          <p>
            <label for="" style="float: left"
              >Modifier le code de la tutelle</label
            >
            <input
              type="text"
              v-model="oldTutelle.code"
              class="codeDirectionInput"
            />
          </p>
          <p>
            <label for="" style="float: left"
              >Modifier la désignation de la tutelle</label
            >
            <input
              type="text"
              v-model="oldTutelle.libelle"
              class="designationDirectionInput"
            />
          </p>

          <button class="button" @click="updateDirection">
            Modifier une tutelle
          </button>
        </form>
      </div>

      <!-- liste des tutelles -->
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
          <th>ACTIONS</th>
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
          <td>
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
      <div id="deleteTutelle" class="modal-vue">
        <div
          class="overlay"
          v-if="deleteTutelle"
          @click="deleteTutelle = false"
        ></div>

        <form
          v-if="deleteTutelle"
          @submit="createTutelle"
          class="formDirection"
        >
          <button class="close" @click="deleteTutelle = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">Êtes-vous sûr de vouloir supprimer cette tutelle ?</p>
          </div>
          <div>
            <button @click="deleteD" class="delete">
              Supprimer une tutelle
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
  } from '../../services/functions';
  export default {
    components: {
      SubHeader,
    },
    name: 'Tutelle',
    data: function () {
      return {
        connectedUser: getCurrentSessionUser().username,
        nbrOfTaskSelected: 0,
        selectedObject: this.nbrOfTaskSelected,
        tutelleForm: {
          placeholder: 'Rechercher une tutelle',
          plusIconeTitle: 'Ajouter Une Tutelle',
          class: {
            search: 'fa fa-search',
            plus: 'fa fa-plus-square faPlus',
          },
        },
        reussite: {
          title: 'Tutelle ajoutée avec succès !',
          icon: 'success',
          text: '',
        },
        echec: {
          title: '',
          icon: 'error',
          text: '',
        },
        isSubHeaderActive: false,
        openForm: false,
        search: '',
        tutelle: {
          code: '',
          libelle: '',
        },
        user: getCurrentSessionUser(),
        oldTutelle: {
          code: '',
          libelle: '',
        },
        tutelles: [],
        showForm: false,
        modifyTutelle: false,
        deleteTutelle: false,
        currentTutelle: '',
        currentCategorieId: '',
        DIRECTIONS: [],
        filteredP: this.tutelles,
        selectedCheckbox: [],
        filteredList: [],
      };
    },
    methods: {
      filterData(value) {
        this.filteredList = this.tutelles.filter(
          (tutelle) =>
            tutelle.libelle.includes(value) || tutelle.code.includes(value)
        );
      },
      createTutelle: async function (event) {
        event.preventDefault();

        const result = await post('tutelles', this.tutelle);

        if (result.status === 201) {
          //Save historique

          /*  var identity = this.user.nom + " " + this.user.prenom;
         await post("historiques", {
          action: "Creation",
          user: identity,
          entity: "Tutelle",
          cible: this.tutelle.libelle,
        }); */

          displayMessage('Tu-Cr');
          this.loadData();
        }
        this.tutelle = { code: '', libelle: '' };
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
          console.log(this.selectedCheckbox);
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
        if (this.tutelles == 0) {
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
            result = await toDelete('tutelles/' + checkbox);
          }
          if (result.status == 201) {
            displayMessage('D-Del');
            this.loadData();
            this.nbrOfTaskSelected = 0;
            this.isSubHeaderActive = false;
          }
        } else {
          displayMessage('Tu-Auth');
        }
      },

      async loadData() {
        const result = await load('tutelles');
        this.tutelles = result.data;
        this.filteredList = this.tutelles;

        this.disableCheckboxForSelectAllField();
      },
      async deleteD() {
        var permission = await isAdmin(this.connectedUser);
        if (permission.status == 200) {
          var result = await toDelete('tutelles/' + this.currentTutelle);
          if (result.status == 201) {
            displayMessage('Tu-Del');
            this.loadData();
            this.deleteTutelle = false;
          }
        } else {
          displayMessage('Tu-Auth');
        }
      },
      showConfirmDelete(currentTutelleId) {
        (this.deleteTutelle = true), (this.currentTutelle = currentTutelleId);
      },
      showModalUpdate(d) {
        this.modifyTutelle = true;
        this.oldTutelle.code = d.code;
        this.oldTutelle.libelle = d.libelle;
        this.currentTutelleId = d._id;
      },
      filtered() {
        this.filteredP = this.tutelles.filter(
          (tutelle) =>
            tutelle.libelle.includes(this.search) ||
            tutelle.code.includes(this.search)
        );
        return this.filteredP;
      },
      async updateDirection(event) {
        event.preventDefault();
        var code = this.oldTutelle.code;
        var libelle = this.oldTutelle.libelle;
        try {
          this.newValue = this.oldLibelle;
          var ok = await update('tutelles/' + this.currentTutelleId, {
            code,
            libelle,
          });

          if (ok.status == 201) {
            displayMessage('Tu-Upd');
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
