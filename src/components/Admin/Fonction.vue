<template>
  <div>
    <!-- entete fonction -->
    <SubHeader
      entity="Fonctions"
      isForProblems="no"
      nbrOfTask="2"
      needSearchBar="yes"
      :form="fonctionsForm"
      :data="fonctions"
      :isSubHeaderActive="isSubHeaderActive"
      :selected="nbrOfTaskSelected"
      :arrayCheckbox="selectedCheckbox"
      :options="options"
      @showForm="showForm = true"
      @sortByRadio = "sortByRadio"
      @filter="filterData"
      @selectedTutelle="selectedTutelle"
      @sortInAlphabeticOrder="sortInAlphabeticOrder"
    />
    <Loader :data="fonctions"/>

    <!-- body fonction -->
    <div class="containerBureau">
      <!-- ajouter une fonction -->
      <div id="showForm" class="modal-vue">
        <!-- <button @click="showForm = true" class="bureauAddButton">+</button> -->
        <div class="overlay" v-if="showForm" @click="showForm = false"></div>

        <form v-if="showForm" @submit="handleSubmit" class="formBureau">
          <button class="close" @click="showForm = false">x</button>

          <h1 class="h1">AJOUTER UNE FONCTION</h1>
          <p>
            <input
              type="text"
              v-model="fonction.code"
              placeholder="Code de la fonction"
              class="codeBureauInput"
            />
          </p>
          <p>
            <input
              type="text"
              v-model="fonction.libelle"
              placeholder="Designation de la fonction"
              class="designationBureauInput"
            />
          </p>

          <p style="width:99%;">
            <select
              v-model="fonction.direction"
              class="selectMateriel"
              name="direction"
              id=""
            >
              <option value="" checked>Selectionner une structure</option>
              <option v-for="d in directions" :key="d._id" :value="d._id">{{
                d.libelle
              }}</option>
            </select>
          </p>
          <button class="button">Ajouter une fonction</button>
        </form>
      </div>

      <!-- modifier une fonction -->
      <div id="modifyBureau" class="modal-vue">
        <div
          class="overlay"
          v-if="modifyBureau"
          @click="modifyBureau = false"
        ></div>

        <form v-if="modifyBureau" class="formBureau">
          <button class="close" @click="modifyBureau = false">x</button>

          <h1 class="h1">MODIFIER UNE FONCTION</h1>
          <p>
            <label for="" style="float:left;">Modifier le code du bureau</label>
            <input
              type="text"
              v-model="oldBureau.code"
              class="codeBureauInput"
            />
          </p>
          <p>
            <label for="" style="float:left;"
              >Modifier la désignation du bureau</label
            >
            <input
              type="text"
              v-model="oldBureau.libelle"
              class="designationBureauInput"
            />
          </p>

          <p style="width:99%;">
            <select
              v-model="oldBureau.direction"
              name="direction"
              class="selectMateriel"
              id=""
            >
              <option value="">Selectionner une Structure</option>
              <option v-for="d in directions" :key="d._id" :value="d._id">{{
                d.libelle
              }}</option>
            </select>
          </p>

          <button class="button" @click="updateBureau">
            Modifier une fonction
          </button>
        </form>
      </div>

      <!-- liste des fonctions -->
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
          <th  v-if="userStatut === 'root'">TUTELLE</th>
          <th>STRUCTURE</th>
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
          <th  v-if="userStatut === 'root'">{{d.direction.tutelle.libelle}}</th>
          <th>{{ d.direction.libelle }}</th>
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
      <div id="deleteBureau" class="modal-vue">
        <div
          class="overlay"
          v-if="deleteBureau"
          @click="deleteBureau = false"
        ></div>

        <form v-if="deleteBureau" @submit.prevent="" class="formBureau">
          <button class="close" @click="deleteBureau = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">
              Êtes-vous sûr de vouloir supprimer cette fonction ?
            </p>
          </div>
          <div>
            <button @click="deleteD" class="delete">
              Supprimer une fonction
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SubHeader from "../General/SubHeader.vue";
import Loader from '../General/Loader.vue';
import {
  load,
  post,
  update,
  toDelete,
  displayMessage,
  isAdmin,
  alphabeticSort,
  changeTitle,
} from "../../services/functions";
import { getCurrentSessionUser } from "../../services/storage";

export default {
  components: {
    SubHeader,
    Loader
  },
  name: "fonction",
  data: function() {
    return {
      connectedUser: getCurrentSessionUser().username,
      nbrOfTaskSelected: 0,
      selectedObject: this.nbrOfTaskSelected,
      fonctionsForm: {
        placeholder: "Rechercher une fonction",
        plusIconeTitle: "Ajouter une fonction",
        class: {
          search: "fa fa-search",
          plus: "fa fa-plus-square faPlus",
        },
      },
      userStatut: getCurrentSessionUser().statut,
      selectedCheckbox: [],
      filteredList: [],

      isSubHeaderActive: false,
      openForm: false,
      fonction: {
        code: "",
        libelle: "",
        direction: "",
      },
      oldBureau: {
        code: "",
        libelle: "",
        direction: "",
      },
      tutelles: [],
      fonctions: [],
      showForm: false,
      modifyBureau: false,
      deleteBureau: false,
      currentBureau: "",
      currentCategorieId: "",
      options: [
        {
          label: "Code",
          value: "code",
         },
         {
          label: "Designation",
          value: "libelle"
        }
      ],
      currentTutelleValue: '',
      filterValue: ''
    };
  },
  methods: {
    handleSubmit: async function(event) {
      event.preventDefault();
      //Do Some verifications
      this.fonction.tutelle = getCurrentSessionUser().tutelle;
      const result = await post("fonctions", this.fonction);

      if (result.status === 201) {
        displayMessage("F-Cr");
        this.loadData();
      }
      this.fonction = { };
    },
     sortByRadio(value){
      this.filteredList = this.filteredList.sort( (a,b) => {
        return ('' + a[value]).localeCompare(b[value]);
      });
    },
    sortInAlphabeticOrder(value) {
     this.filteredList = alphabeticSort(this.filteredList, value);
    },
    selectedTutelle(value) {
      this.currentTutelleValue = value
      if (value != "") {
        this.filteredList = this.fonctions.filter( fonction => fonction.tutelle._id === value &&  (( fonction.libelle.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) || fonction.code.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim() ))))
      } else {
        this.filteredList = this.fonctions
      }
    },
    filterData(value) {
      this.filterValue = value;
      this.filteredList = this.fonctions;
      if ( this.currentTutelleValue != "") {
         this.filteredList = this.fonctions.filter(
           (fonction) => {
          return ( ( fonction.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) || fonction.code.toLowerCase().trim().includes(value.toLowerCase().trim() )) && fonction.tutelle._id === this.currentTutelleValue) ;
        }
      );
      } else {
        this.filteredList = this.fonctions.filter(
        (fonction) => {
          return ( ( fonction.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) || fonction.code.toLowerCase().trim().includes(value.toLowerCase().trim() )) )
        }
      );
      }
     
    },
    async loadData() {
      // var directionId = getCurrentSessionUser().direction;
      if ( this.userStatut === 'root') {
          const result = await load("fonctions/all");
          this.fonctions = result.data;
          this.filteredList = this.fonctions;

          var resultDirection = await load("directions/all");
          this.directions = resultDirection.data;
          
      } else {
        // "directions?tutelleId="+tutelleId
        const result = await load("fonctions/all");
        this.fonctions = result.data;
        this.filteredList = this.fonctions;
        var rd = await load("directions/all");
        this.directions = rd.data;
        // this.directions = resultDirection.data;
      }
        this.disableCheckboxForSelectAllField();
    },
    async deleteD() {
      var permission = await isAdmin(this.connectedUser);
      if (permission.status === 200) {
        await toDelete("fonctions/" + this.currentBureau);  
        displayMessage("F-Del");
        this.loadData();
        this.deleteBureau = false;
      } else {
        displayMessage("F-Auth");
      }
    },
    showConfirmDelete(currentBureauId) {
      (this.deleteBureau = true), (this.currentBureau = currentBureauId);
    },
    showModalUpdate(d) {
      this.modifyBureau = true;
      this.oldBureau.code = d.code;
      this.oldBureau.libelle = d.libelle;
      this.currentBureauId = d._id;
    },
    async updateBureau(event) {
      event.preventDefault();
      var code = this.oldBureau.code;
      var libelle = this.oldBureau.libelle;
      var direction = this.oldBureau.direction;

      console.log()
      try {
        await update("fonctions/" + this.currentBureauId, {code,libelle, direction})
        // await update("fonctions/" + this.currentBureauId, {
        //   code,
        //   direction,
        // });
        this.loadData();
        displayMessage("F-Upd");
        this.modifyBureau = false;
      } catch (e) {
        //Nothing to do
      }
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
      if (this.fonctions == 0) {
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
      if (permission.status === 200) {
        for (var checkbox of this.selectedCheckbox) {
          await toDelete("fonctions/" + checkbox);
        }
        displayMessage("F-Del");
        this.nbrOfTaskSelected = 0;
        this.isSubHeaderActive = false;
        this.loadData();
      } else {
        displayMessage("F-Auth");
      }
    },
  },

  mounted: function() {
    this.loadData();
    this.disableCheckboxForSelectAllField();
    changeTitle(this.$route.name)
  },
};
</script>

<style scoped>
hr {
  margin: auto;
  width: 95%;
}
p {
  margin: 15px;
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
.selectMateriel {
  margin-bottom: 0px;
  background-color: rgb(52, 158, 52);
  color: white;
  height: 40px;
  font-size: 15px;
}
.selectMateriel option {
  background-color: gainsboro;
  color: black;
}
table {
  border-collapse: collapse;
  width: 90%;
  margin: auto;
}
th {
  font-size: 17px;
}
th,
td {
  text-align: left;
  padding: 20px;
  font-weight: normal;
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
.containerBureau {
  width: 100%;
  margin: 0 auto;
}
.formBureau {
  width: 40%;
  z-index: 9999;
  margin: auto;
  text-align: center;
  padding: 30px 40px;
  background-color: gainsboro;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 35%;
}
.codeBureauInput,
.designationBureauInput {
  width: 100%;
  border: 2px solid #ccc;
  font-size: 10px;
  outline: none;
  padding: 2%;
  border-radius: 5px;
  font-size: 17px;
  margin: auto;
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
    .addBureau
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
    .formBureau
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
    .formBureau
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
    .addBureau
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
    .formBureau
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
    .formBureau
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
    .formBureau
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
    .formBureau
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
    .codeBureauInput,.designationBureauInput
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
    .titleAddBureau
    {
      font-size: 20px;
      margin-left: 5%;
    }
    .addBureau
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
    .formBureau
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
    .codeBureauInput,.designationBureauInput
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
    .titleAddBureau
    {
      font-size: 15px;
      margin-left: 2%;
    }
    .addBureau
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
    .formBureau
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
    .codeBureauInput,.designationBureauInput
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
    .titleAddBureau
    {
      font-size: 15px;
      margin-left: 2%;
    }
    .addBureau
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
    .formBureau
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
    .codeBureauInput,.designationBureauInput
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
    .titleAddBureau
    {
      font-size: 12px;
    }
    .addBureau
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
