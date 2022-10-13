<template>
  <div>
    <!-- entete modele -->
    <SubHeader
      entity="Modele"
      isForProblems="no"
      nbrOfTask="2"
      needSearchBar="yes"
      :form="modeleForm"
      :data="modeles"
      @showForm="showForm = true"
      @filter="filterData"
      :isSubHeaderActive="isSubHeaderActive"
      :selected="nbrOfTaskSelected"
      :arrayCheckbox="selectedCheckbox"
    />

    <!-- body modele -->
    <div class="categorieContainer">
      <div class="modal-container" v-if="isModalOpen">
        <div
          :class="isSuccess ? 'success' : 'error'"
          v-if="responsePost != ''"
          style="margin: 0 auto; transform: translateY(35px)"
        >
          {{ responsePost }}
        </div>
      </div>

      <!-- AJOUTER UNE MODELE -->
      <div class="containerCategorie">
        <div id="showForm" class="modal-vue">
          <!-- <button @click="showForm = true" class="categorieAddButton">+</button> -->
          <div class="overlay" v-if="showForm" @click="showForm = false"></div>

          <form v-if="showForm" @submit="handleSubmit" class="formCategorie">
            <button class="close" @click="showForm = false">x</button>

            <h1 class="h1">AJOUTER UN MODELE</h1>
            <p>
              <input
                type="text"
                v-model="modele.libelle"
                placeholder="Designation du modele"
                class="codeCategorieInput"
              />
            </p>
            <p style="width: 99%" v-if="userStatut == 'root'">
              <select
                v-model="modele.tutelle"
                name="tutelle"
                class="selectMateriel"
                id=""
              >
                <option value="">Selectionner une tutelle</option>
                <option v-for="t in tutelles.data" :key="t._id" :value="t._id">
                  {{ t.libelle }}
                </option>
              </select>
            </p>

            <button class="button">Ajouter un modele</button>
          </form>
        </div>

        <!-- MODIFICATION fonction -->

        <div id="modifyModele" class="modal-vue">
          <div
            class="overlay"
            v-if="modifyModele"
            @click="modifyModele = false"
          ></div>
          <form
            v-if="modifyModele"
            @submit="handleSubmit"
            class="formCategorie"
          >
            <button class="close" @click="modifyModele = false">x</button>

            <h1 class="h1">MODIFIER LE MODELE</h1>
            <p>
              <label for="" style="float: left">Modifier le modele</label>
              <input
                type="text"
                name="modele"
                v-model="oldModele.libelle"
                class="codeCategorieInput"
              />
            </p>
            <!--  <p style="width:99%;">
            <select
              v-model="oldModele.tutelle"
              name="tutelle"
              class="selectMateriel"
              id=""
            >
               <option value="">Selectionner une tutelle</option>
               <option v-for="t in tutelles.data" :key="t._id" :value="t._id">{{
                t.libelle
              }}</option>
            </select>
          </p> -->

            <button @click="updateCategory" class="button">
              Modifier un modele
            </button>
          </form>
        </div>
      </div>

      <!-- liste des modeles -->
      <table>
        <tr>
          <th>
            <input
              type="checkbox"
              ref="checkboxForSelectAllField"
              @click="selectAll($event)"
            />
          </th>
          <th>LIBELLE</th>
          <th v-if="userStatut == 'root'">TUTELLE</th>
          <th>ACTIONS</th>
        </tr>
        <tr v-for="c in filteredList" :key="c._id">
          <td>
            <input
              type="checkbox"
              @click="selectCheckbox($event)"
              name=""
              id=""
            />
            <input type="hidden" :value="c._id" name="" />
          </td>
          <td>{{ c.libelle }}</td>
          <td v-if="userStatut == 'root'">{{ c.tutelle.libelle }}</td>
          <td>
            <button
              @click="showModalUpdate(c)"
              class="faEdit fas fa-edit"
            ></button>
            <button
              @click="showConfirmDelete(c)"
              class="faTrash fas fa-trash-alt"
            ></button>
          </td>
        </tr>
      </table>

      <!-- supprimer une modele -->
      <div id="deleteModele" class="modal-vue">
        <div
          class="overlay"
          v-if="deleteModele"
          @click="deleteModele = false"
        ></div>

        <form v-if="deleteModele" class="formCategorie">
          <button class="close" @click="deleteModele = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">Êtes-vous sûr de vouloir supprimer ce modele ?</p>
          </div>
          <div>
            <button @click="deleteCategory" class="delete">
              Supprimer un modele
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  //import { _SERVER_URL } from "../../services/environment";
  import SubHeader from '../General/SubHeader.vue';
  import {
    load,
    post,
    update,
    toDelete,
    displayMessage,
    isAdmin,
  } from '../../services/functions';
  import { getCurrentSessionUser } from '../../services/storage';

  export default {
    components: {
      SubHeader,
    },
    data() {
      return {
        connectedUser: getCurrentSessionUser().username,
        nbrOfTaskSelected: 0,
        selectedObject: this.nbrOfTaskSelected,
        modeleForm: {
          placeholder: 'Rechercher un modele',
          plusIconeTitle: 'Ajouter un modele',
          class: {
            search: 'fa fa-search',
            plus: 'fa fa-plus-square faPlus',
          },
        },
        userStatut: getCurrentSessionUser().statut,
        tutelles: [],
        selectedCheckbox: [],
        filteredList: [],
        openForm: false,
        isSuccess: false,
        isModalOpen: false,
        id: '',
        newValue: '',
        modele: {
          libelle: '',
          tutelle: '',
        },
        oldModele: {
          libelle: '',
          tutelle: '',
        },
        responsePost: '',
        modeles: [],
        actualValue: 'Modifier from Vue...',
        showForm: false,
        modifyModele: false,
        deleteModele: false,
        currentFournisseur: '',
        oldLibelle: '',
      };
    },
    methods: {
      async handleSubmit(event) {
        event.preventDefault();

        if (this.modele.libelle == '') {
          //this.responsePost = "Veuillez remplir convenablement le champ vide ";
          displayMessage('Fr-EmpF');
        } else {
          if (this.userStatut === 'root') {
            const response = await post('modeles', this.modele);
            if (response.status != 201) {
              this.responsePost = response.message;
            } else {
              this.responsePost = response.message;
              this.modele.libelle = '';
              this.isSuccess = true;

              displayMessage('Fr-Cr');
              this.loadData();
            }
          } else {
            this.modele.tutelle = getCurrentSessionUser().tutelle;
            const response = await post('modeles', this.modele);
            if (response.status != 201) {
              this.responsePost = response.message;
            } else {
              this.responsePost = response.message;
              this.modele.libelle = '';
              this.isSuccess = true;

              displayMessage('Fr-Cr');
              this.loadData();
            }
          }
        }
      },
      async loadData() {
        var tutelleId = getCurrentSessionUser().tutelle;
        if (this.userStatut === 'root') {
          const res = await load('modeles/all');
          this.modeles = res.data;

          this.tutelles = await load('tutelles');
          this.filteredList = this.modeles;
        } else {
          const res = await load('modeles?tutelle=' + tutelleId);
          this.modeles = res.data;

          this.tutelles = await load('tutelles');
          this.filteredList = this.modeles;
        }

        this.disableCheckboxForSelectAllField();
      },
      cancelModelShowing() {
        this.isModalOpen = false;
        this.responsePost = '';
        this.newValue = '';
      },
      async deleteCategory() {
        var permission = await isAdmin(this.connectedUser);
        if (permission.status === 200) {
          var result = await toDelete('modeles/' + this.currentCategorieId);
          if (result.status == 201) {
            displayMessage('Fr-Del');
            this.loadData();
          }
        } else {
          displayMessage('Fr-Auth');
        }
      },
      showModalUpdate(c) {
        this.modifyModele = true;
        this.oldModele.libelle = c.libelle;
        this.oldModele.tutelle = getCurrentSessionUser().tutelle;
        this.currentCategorieId = c._id;
      },
      async updateCategory(event) {
        event.preventDefault();

        try {
          this.newValue = this.oldModele.libelle;
          const mod = await update('modeles/' + this.currentCategorieId, {
            libelle: this.newValue,
          });

          if (mod.status === 201) {
            this.isSuccess = true;
            this.responsePost = mod.message;
            this.actualValue = '';
            this.loadData();
            displayMessage('Fr-Upd');
          }
        } catch (error) {
          //Nothing to do
        }
      },
      showConfirmDelete(currentCategorieId) {
        (this.deleteModele = true),
          (this.currentCategorieId = currentCategorieId._id);
      },
      filterData(value) {
        this.filteredList = this.modeles.filter((modele) => {
          return modele.libelle.includes(value);
        });
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
        if (this.modeles == 0) {
          this.$refs.checkboxForSelectAllField.disabled = true;
        } else {
          this.$refs.checkboxForSelectAllField.disabled = false;
          this.$refs.checkboxForSelectAllField.checked = false;
        }
      },
      selectCheckbox($event) {
        console.log($event);
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

        if (permission.status === 200) {
          for (var checkbox of this.selectedCheckbox) {
            var result = await toDelete('modeles/' + checkbox);
          }
          if (result.status == 201) {
            displayMessage('Fr-Del');
            this.nbrOfTaskSelected = 0;
            this.isSubHeaderActive = false;
            this.loadData();
          }
        } else {
          displayMessage('Fr-Auth');
        }
      },
    },
    mounted() {
      this.loadData();
      this.disableCheckboxForSelectAllField();
    },
  };
</script>

<style scoped lang="scss">
  th {
    font-size: 17px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: auto;
  }
  .h1 {
    font-size: 25px;
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
  p {
    margin: 15px;
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
  .categorieContainer {
    width: 100%;
    margin: 0 auto;
  }
  .containerCategorie {
    width: 100%;
    margin: 0 auto;
  }
  .categorieAddButton {
    float: left;
    position: relative;
    top: 10px;
    left: 25px;
    width: 10%;
    background-color: rgb(22, 133, 38);
    border-bottom: 5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 20px;
    color: whitesmoke;
    transition: all 0.5s;
  }
  .titleAddCategorie {
    font-size: 20px;
    margin-left: 17%;
  }
  .titleModifyCategorie {
    font-size: 20px;
    margin-left: 17%;
    margin-bottom: 2%;
  }
  .codeCategorieInput {
    width: 100%;
    border: 2px solid #ccc;
    font-size: 10px;
    outline: none;
    padding: 2%;
    border-radius: 5px;
    font-size: 17px;
    margin: auto;
  }
  .formCategorie {
    width: 40%;
    z-index: 9999;
    margin: auto;
    text-align: center;
    padding: 30px 40px;
    background-color: gainsboro;
    border-radius: 5px;
    position: absolute;
    top: 30%;
    left: 35%;
  }

  .addCategorie {
    width: 15%;
    background-color: rgb(22, 133, 38);
    border-bottom: 5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color: whitesmoke;
    transition: all 0.5s;
    margin-left: 17%;
    padding: 2px;
  }
  .modifyModele {
    width: 18%;
    background-color: rgb(22, 133, 38);
    border-bottom: 5px solid rgb(13, 80, 23);
    border-radius: 7px;
    font-size: 15px;
    color: whitesmoke;
    transition: all 0.5s;
    margin-left: 17%;
    margin-top: 2%;
    padding: 2px;
  }
  .annuleFormCategorie {
    margin-left: 2%;
    width: 15%;
    background-color: rgb(233, 54, 54);
    border-bottom: 5px solid rgb(90, 7, 7);
    border-radius: 7px;
    font-size: 20px;
    color: whitesmoke;
    transition: all 0.5s;
  }

  form div {
    margin: 10px 0 15px 0;
  }

  .list:hover {
    cursor: pointer;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 50px;
    box-shadow: 0 4px 4px 0 #777;
    padding: 10px;
    border-radius: 3px;
    border-top: solid 5px rgb(14, 63, 33);
    text-align: center;
    line-height: 2;
    transition: 0.3s ease-in-out;
    width: 100%;
    margin: 30px 0 0 0;
  }
  .list:hover {
    transform: scale(1.05);
    transition: 0.5s ease-in-out;
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

  /*------mediaQuery--------*/
  /* @media screen and (max-width: 1000px) 
{
  .addCategorie
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
  .formCategorie
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
  .formCategorie
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
  .addCategorie
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
  .formCategorie
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
  .formCategorie
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
  .formCategorie
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
  .formCategorie
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
  .codeCategorieInput,.designationCategorieInput
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
  .titleAddCategorie
  {
    font-size: 20px;
    margin-left: 5%;
  }
  .addCategorie
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
  .formCategorie
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
  .codeCategorieInput,.designationCategorieInput
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
  .titleAddCategorie
  {
    font-size: 15px;
    margin-left: 2%;
  }
  .addCategorie
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
  .formCategorie
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
  .codeCategorieInput,.designationCategorieInput
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
  .titleAddCategorie
  {
    font-size: 15px;
    margin-left: 2%;
  }
  .addCategorie
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
  .formCategorie
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
  .codeCategorieInput,.designationCategorieInput
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
  .titleAddCategorie
  {
    font-size: 12px;
  }
  .addCategorie
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
</style>
