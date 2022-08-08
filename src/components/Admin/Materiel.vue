<template>
  <div>
    <!-- entete materiel -->
    <SubHeader
      entity="Materiels"
      isForProblems ="no"
      nbrOfTask="2"
      needSearchBar="yes"
      :form="materielForm"
      :data="materiels"
      :isSubHeaderActive="isSubHeaderActive"
      :selected="nbrOfTaskSelected"
      :arrayCheckbox="selectedCheckbox"
      :options="options"
       materiel="true"
      :checkboxes="checkboxes"
      @sortByRadio = "sortByRadio"
      @showForm="showForm = true"
      @filter="filterData"
      @selectedTutelle="selectedTutelle"
      @sortInAlphabeticOrder="sortInAlphabeticOrder"

     
    />
    <Loader :data="materiels"/>
    <!-- body materiel -->
    <div class="containerMateriel">
      <!-- ajouter un materiel -->
      <div id="showForm" class="modal-vue">
        <!-- <button @click="showForm = true" class="addMaterielButton">+</button> -->
        <div class="overlay" v-if="showForm" @click="showForm = false"></div>

        <form v-if="showForm" @submit="handleSubmit" class="formMaterielAdd">
          <button class="close" @click="showForm = false">x</button>

          <h1 class="h1">AJOUTER UN MATERIEL</h1>
          <!--   <div :class="isSuccess ? 'success' : 'error'" v-if="responsePost != ''">
          {{ responsePost }} -->
          <div class="divForm">
            <div class="divForm1">
              <p>
                <label for="">Entrer le libellé</label>
                <input class="input" type="text" v-model="materiel.libelle" />
              </p>
              <p>
                <label for="">Entrer la référence </label>
                <input class="input" type="text" v-model="materiel.reference" />
              </p>
              <p>
                <label for="">Entrer le type</label>
                <input class="input" type="text" v-model="materiel.type" />
              </p>
              <p>
                <label for="">Entrer la marque</label>
                <input class="input" type="text" v-model="materiel.marque" />
              </p>
              <p>
                <label for="">Entrer le numero</label>
                <input class="input" type="text" v-model="materiel.numero" />
              </p>
            </div>

            <div class="divForm2">
              <p>
                 <label for="">Selectionner un fournisseur</label>
                   <Autocomplete ref="autocompleteRef" @selectedValue ="selectedValue" :dataSource ="newFournisseur" placeholder="Selectionner un fournisseur"/>
              </p>
               <!-- <p>
                  <label for="">Selectionner un modele</label>
                <Autocomplete ref="autocompleteRef" @selectedValue ="selectedValue" :dataSource ="newModele" placeholder="Selectionner un model"/>
              </p> -->
              <p>
                <label>Selectionner une categorie</label>
                <select
                  v-model="materiel.categorie"
                  name="categorie"
                  class="selectMateriel"
                >
                  <option v-for="d in categories" :key="d._id" :value="d._id">
                    {{ d.libelle }}
                  </option>
                </select>
              </p>
              <p>
                <label>Selectionner une structure</label>
                <select
                  v-model="materiel.direction"
                  name="direction"
                  class="selectMateriel"
                >
                  <option v-for="d in directions" :key="d._id" :value="d._id">
                    {{ d.libelle }}
                  </option>
                </select>
              </p>
              <p>
                <button class="button">Ajouter un matériel</button>
              </p>
            </div>
          </div>
        </form>
      </div>
      <!-- liste du materiel -->
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
          <th>REFERENCE</th>
          <th>TYPE</th>
          <th>MARQUE</th>
          <!-- <th>MODEL</th> -->
          <th>NUMERO</th>
          <th>FOURNISSEUR</th>
          <th>CATEGORIE</th>
          <th>STRUCTURE<th>
          <th style="position:relative;right:100px">STATUT</th>
          <th v-if="userStatut == 'root'">TUTELLE</th>
          <th style="position:relative;right:90px">ACTIONS</th>
        </tr>
        <tr v-for="m in filteredList" :key="m._id">
          <td>
            <input
              type="checkbox"
              @click="selectCheckbox($event)"
              name=""
              id=""
            />
            <input type="hidden" :value="m._id" name="" />
          </td>
          <td>{{ m.libelle }}</td>
          <td>{{ m.reference }}</td>
          <td>{{ m.type }}</td>
          <td>{{ m.marque }}</td>
          <!-- <td>{{ m.model.libelle }}</td> -->
          <td>{{ m.numero }}</td>
          <td>{{ m.fournisseur.libelle }}</td>
          <td>{{ m.categorie.libelle}}</td>
          <!-- <td><b><i>loading...</i></b></td> -->
         <td>{{ m.direction.code }}</td>
          <td>{{ m.statut }}</td>
          <td v-if="userStatut == 'root'">{{ m.tutelle.libelle }}</td>
          <td>
            <button
              @click="showModalUpdate(m)"
              class="faEdit fas fa-edit"
            ></button>
            <button
              @click="showConfirmDelete(m)"
              class="faTrash fas fa-trash-alt"
            ></button>
          </td>
        </tr>
      </table>

      <!-- MODIFIER MATERIEL -->
      <div id="modifyMateriel" class="modal-vue">
        <div
          class="overlay"
          v-if="modifyMateriel"
          @click="modifyMateriel = false"
        ></div>

        <form
          v-if="modifyMateriel"
          @submit="handleSubmit"
          class="formMaterielAdd"
        >
          <button class="close" @click="modifyMateriel = false">x</button>

          <h1 class="h1">MODIFIER UN MATERIEL</h1>
          <!--   <div :class="isSuccess ? 'success' : 'error'" v-if="responsePost != ''">
            {{ responsePost }} -->
          <div class="divForm">
            <div class="divForm1">
              <p>
                <label for="">Modifier le libellé</label>
                <input class="input" type="text" v-model="updateM.libelle" />
              </p>
              <p>
                <label for="">Modifier la référence </label>
                <input class="input" type="text" v-model="updateM.reference" />
              </p>
              <p>
                <label for="">Modifier le type</label>
                <input class="input" type="text" v-model="updateM.type" />
              </p>
              <p>
                <label for="">Modifier la marque</label>
                <input class="input" type="text" v-model="updateM.marque" />
              </p>
            </div>

            <div class="divForm2">
              <!-- <p>
                <label for="">Modifier le model</label>
                <input class="input" type="text" v-model="updateM.model" />
              </p> -->
              <p>
                <label for="">Modifier le numero</label>
                <input class="input" type="text" v-model="updateM.numero" />
              </p>
               <!-- <p>
                 <label for="">Selectionner un fournisseur</label>
                   <Autocomplete ref="autocompleteRef" @selectedValue ="selectedValue" :dataSource ="newFournisseur" placeholder="Selectionner un fournisseur"/>
                  <label value="">Selectionner un modele</label>
                <select
                  v-model="updateM.model"
                  name="modele"
                  class="selectMateriel"
                >
                  <option value="">Selectionner un modele</option>
                  <option v-for="m in modeles" :key="m._id" :value="m._id">
                    {{ m.libelle }}
                  </option>
                </select>
              </p> -->
             <!--  <p>
                <label for="">Modifier le fournisseur</label>
                <input
                  class="input"
                  type="text"
                  v-model="updateM.fournisseur"
                />
              </p> -->
               <p style="width: 97%">
                <label for="" style="float: left">Modifier le Fournisseur</label>
                <select
                  v-model="updateM.fournisseur"
                  name="categorie"
                  class="selectMateriel"
                >
                  <option value="">Selectionner un Fournisseur</option>
                  <option v-for="f in fournisseurs" :key="f._id" :value="f._id">
                    {{ f.libelle }}
                  </option>
                </select>
              </p>

              <p style="width: 97%">
                <label for="" style="float: left">Modifier une catégorie</label>
                <select
                  v-model="updateM.categorie"
                  name="categorie"
                  class="selectMateriel"
                >
                  <option value="">Selectionner une categorie</option>
                  <option v-for="d in categories" :key="d._id" :value="d._id">
                    {{ d.libelle }}
                  </option>
                </select>
              </p>
              <p style="width: 97%">
                <label for="" style="float: left">Modifier une structure</label>
                <select
                  v-model="updateM.direction"
                  name="direction"
                  class="selectMateriel"
                >
                  <option value="">Selectionner une structure</option>
                  <option v-for="d in directions" :key="d._id" :value="d._id">
                    {{ d.libelle }}
                  </option>
                </select>
              </p>
            <!--  <p>
                <label for="" style="float: left">Modifier une tutelle</label>
                <select
                  class="selectMateriel"
                  id=""
                 v-model="updateM.tutelle"
                >
                <option value="">Selectionner une tutelle</option>
                <option v-for="t in tutelles.data" :key="t._id" :value="t._id">{{
                    t.libelle
                  }}</option>
                </select>
             </p> -->
              <p>
                <button class="button" @click="updateMateriel">
                  Modifier un matériel
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>

      <!-- CONFIRMER LA SUPPRESSION -->
      <div id="deleteMateriel" class="modal-vue">
        <div class="overlay" v-if="deleteMat" @click="deleteMat = false"></div>
        <form v-if="deleteMat" @submit="handleSubmit" class="formMateriel">
          <button class="close" @click="deleteMat = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">Êtes-vous sûr de vouloir supprimer ce matériel ?</p>
          </div>
          <div>
            <button @click="deleteMateriel" class="delete">
              Supprimer un matériel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
//import { _SERVER_URL } from "../../services/environment";
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
  // resetObjectPropertyValueToEmpty
} from "../../services/functions";
import { getCurrentSessionUser } from "../../services/storage";
// import Autocomplete from '../General/Autocomplete.vue'
import Autocomplete from '../General/Autocomplete.vue'


export default {
  components: {
    SubHeader, Autocomplete, Loader
  },
  data() {
    //reference, type, marque/model, numero, status
    return {
      connectedUser: getCurrentSessionUser().username,
      nbrOfTaskSelected: 0,
      selectedObject: this.nbrOfTaskSelected,
      materielForm: {
        placeholder: "Rechercher un materiel",
        plusIconeTitle: "Ajouter un materiel",
        class: {
          search: "fa fa-search",
          plus: "fa fa-plus-square faPlus",
        },
      },
      isSubHeaderActive: false,
      materiel: {
        libelle: "",
        reference: "",
        type: "",
        marque: "",
        numero: "",
        categorie: "",
        fournisseur: '',
        // model: '',
        direction: ''
      },
      newModele: [],
      newFournisseur: [],
      tutelles: [],
      selectedCheckbox: [],
      filteredList: [],
      openForm: false,
      updateM: {
        libelle: "",
        reference: "",
        type: "",
        marque: "",
        numero: "",
        fournisseur: "",
        // model: "",
        categorie: "",
        direction:''
      },
      newData: [],
      userStatut: getCurrentSessionUser().statut,
      fournisseurs: [],
      modeles: [],
      materiels: [],
      responsePost: "",
      isSuccess: false,
      fonctions: [],
      categories: [],
      showForm: false,
      modifyMateriel: false,
      deleteMat: false,
      currentMaterielId: "",
      ids: new Set(),
      idsEntity: [],
      types: [],
      userTutelle: getCurrentSessionUser().tutelle, 
       options: [
        {
          label: "Code",
          value: "code",
         },
         {
          label: "Designation",
          value: "libelle"
        },
         {
          label: "Type",
          value: "type"
        },
         {
          label: "Marque",
          value: "libelle"
        },
         {
          label: "Modele",
          value: "modele"
        },
         {
          label: "Numero",
          value: "numero"
        },
         {
          label: "Catégorie",
          value: "categorie"
        },
         {
          label: "Statut",
          value: "statut"
        },
         {
          label: "Structure",
          value: "direction"
        },
      ],
      filterOptions: ["libelle","reference","type","marque","numero","fournisseur","categorie","statut", 'direction'],
      defaultLabel: "Trier selon une tutelle",
      /* Type
        Marque
        Modele
        Fournisseur
        Statut */
      checkboxes: [
        {
          label: "Modele",
          data:"modeles"
        }
      ],
      currentTutelleValue: '',
      filterValue: ''
    };
  },
  methods: {
     sortByRadio(value){
      this.filteredList = this.filteredList.sort( (a,b) => {
        return ('' + a[value]).localeCompare(b[value]);
      });
    },
    sortInAlphabeticOrder(value) {
     this.filteredList = alphabeticSort(this.filteredList,value)
    },
    selectedTutelle(value) {
      this.currentTutelleValue = value
      if (value != "") {
        this.filteredList = this.filteredList.filter( materiel => materiel.tutelle._id === value &&  ( materiel.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.reference.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.type.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.marque.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.categorie.libelle.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.model.libelle.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.statut.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) ||
                materiel.fournisseur.libelle.toLowerCase().trim().includes(this.filterValue.toLowerCase().trim())
              ) )
      } else {
        this.filteredList = this.materiels
      }
    },
     filterData(value) {
       this.filterValue= value;
        this.filteredList = this.materiels;
        // this.filteredList = filtering(this.materiels,value,this.filterOptions,this.currentTutelleValue)
        if ( this.currentTutelleValue != "") {
          this.filteredList = this.materiels.filter((materiel) => {
          return (
              ( materiel.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.reference.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.type.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.marque.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.categorie.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                // materiel.model.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.direction.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.statut.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.fournisseur.libelle.toLowerCase().trim().includes(value.toLowerCase().trim())
              ) 
            );
         });
        } else {
          this.filteredList = this.materiels.filter((materiel) => {
          return (
              ( materiel.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.reference.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.type.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.marque.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.categorie.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                // materiel.model.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.direction.libelle.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.statut.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                materiel.fournisseur.libelle.toLowerCase().trim().includes(value.toLowerCase().trim())
              ) 
            );
         });
        }
        
    },
    selectedValue(value) {
      /* Get all value of the different Autocomplete components*/
      if ( !this.ids.has(value.entity)) {
        this.ids.add(value.entity)
        this.idsEntity.push(value)
      } else {
        for ( let elt of this.idsEntity ) {
         if( elt.entity === value.entity ) elt.id = value.id
        }

      }
    },
    async handleSubmit(event) {
      event.preventDefault();
      //Verification des champs
      if (this.materiel.libelle === "") {
        displayMessage("M-EmpF");
        this.isSuccess = false;
      } else {
        // this.materiel['status'] = 'Disponible';
        // this.materiel.tutelle = this.userTutelle;
        let data;
        for (let  elt of this.idsEntity ) {
          if ( elt.newData != undefined) {

              if (elt.entity == 'fournisseur') {
                var en = "fournisseur"
                data =  {libelle: elt.newData, tutelle: "null" };
                await post("fournisseurs",data);
                var fou = await load('fournisseurs/all');
                var len = fou.data.length;
                this.materiel[en] = fou.data[len- 1]._id
            }
            var resp = await load(elt.entity+'s/all');
            var numberOfElts = resp.data.length;
            this.materiel[elt.entity] = resp.data[numberOfElts - 1]._id
          } else{
            this.materiel[elt.entity] = elt.id;
          }
        }
      console.log(this.materiel)

        await post("materiels", this.materiel);
        // resetObjectPropertyValueToEmpty(this.materiel);
        // this.idsEntity = [];
        displayMessage("M-Cr");
        this.loadMateriels();
      }
    },
    showModalUpdate(currentMateriel) {
      this.currentMaterielId = currentMateriel._id;
      this.modifyMateriel = true;
      this.updateM.libelle = currentMateriel.libelle;
      this.updateM.reference = currentMateriel.reference;
      this.updateM.marque = currentMateriel.marque;
      // this.updateM.model = currentMateriel.model;
      this.updateM.numero = currentMateriel.numero;
      this.updateM.categorie = currentMateriel.categorie;
      this.updateM.fonction = currentMateriel.fonction;
      this.updateM.fournisseur = currentMateriel.fournisseur;
      this.updateM.type = currentMateriel.type;
      this.updateM.direction = currentMateriel.direction;
      
      //  this.updateM.tutelle = getCurrentSessionUser().tutelle;
    },
    async updateMateriel() {
      if (this.updateM.fonction == "" || this.updateM.categorie == "") {
        displayMessage("M-EmpF");
      } else {
        const res = await update(
          "materiels/" + this.currentMaterielId,
          this.updateM
        );

        if (res.status == 201) {
          displayMessage("M-Upd");
        } else {
          displayMessage(
            "Oops",
            "Veuillez réessayer dans quelques instants",
            "warning"
          );
        }
        this.loadMateriels();
      }
    },
    async deleteMateriel(e) {
      e.preventDefault();
      var permission = await isAdmin(this.connectedUser);
      if (permission.status == 200) {
        await toDelete("materiels/" + this.currentMaterielId);
        displayMessage("M-Del");
        this.deleteMat = true;
        this.loadMateriels("materiels/" + this.currentMaterielId);
      } else {
        displayMessage("M-Auth");
      }
    },
    async loadMateriels() {
      // var tutelleId = getCurrentSessionUser().tutelle;
      if ( this.userStatut === 'root') {
        const resulCat = await load("categories/all");
        this.categories = resulCat.data;
  
        const response = await load("materiels/all");
        this.materiels = response.data;


      } else {
        // tutelleId = getCurrentSessionUser().tutelle;
         const resulCat = await load("categories/all");
        this.categories = resulCat.data;
  
        const response = await load("materiels/all");
        this.materiels = response.data;
      }
      // this.tutelles = await load('tutelles');

      this.filteredList = this.materiels.map((it) => ({
        ...it,
      }));
      this.disableCheckboxForSelectAllField();
    },
    async loadData() {
      if ( this.userStatut === 'root') {
        //  tutelleId = getCurrentSessionUser().tutelle;
        var directionId = getCurrentSessionUser().direction;
        const resultBureaux = await load("fonctions/all");
        this.fonctions = resultBureaux.data;
        this.newData = this.fonctions.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
          });

        const fournisseurs = await load("fournisseurs/all");
        this.fournisseurs = fournisseurs.data;
         this.newFournisseur = this.fournisseurs.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
          });
        //  this.newFournisseur = this.fournisseurs.map(elt => elt.libelle );
        const resulCat = await load("categories/all");
        this.categories = resulCat.data;

        //  load Direction
        const directions = await load("directions/all");
        this.directions = directions.data;
        
        const modeles = await load("modeles/all");
        this.modeles = modeles.data;
        
        this.newModele = this.modeles.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
          });
        // this.newModele = this.modeles.map(elt => elt.libelle );

      } else {
        //  var tutelleId = getCurrentSessionUser().tutelle;
        directionId = getCurrentSessionUser().direction;

        const directions = await load("directions/all");
        this.directions = directions.data;
        // const resultBureaux = await load("fonctions?directionId="+directionId);
        const resultBureaux = await load("fonctions/all?directionId="+directionId);
         this.fonctions = resultBureaux.data;
          this.newData = this.fonctions.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
          });

        const fournisseurs = await load("fournisseurs/all");
        this.fournisseurs = fournisseurs.data;
        this.newFournisseur = this.fournisseurs.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
          });

        const modeles = await load("modeles/all");
        this.modeles = modeles.data;
        this.newModele = this.modeles.map(elt => {
          return {libelle: elt.libelle, id: elt._id }
        });

        const resulCat = await load("categories/all");
        this.categories = resulCat.data;
      }
    },
    cancel() {
      (this.openForm = false), (this.libelle = "");
      (this.reference = ""), (this.marque = "");
      this.model = "";
      this.numero = "";
      this.status = "";
      (this.categorie = ""),
        (this.fonction = ""),
        (this.responsePost = ""),
        (this.isSuccess = false);
    },
    showConfirmDelete(currentMateriel) {
      (this.deleteMat = true), (this.currentMaterielId = currentMateriel._id);
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
      if (this.materiels == 0) {
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
        for (var checkbox of this.selectedCheckbox) {
          await toDelete("materiels/" + checkbox);
        }
        displayMessage("M-Del");
        this.nbrOfTaskSelected = 0;
        this.isSubHeaderActive = false;
        this.loadMateriels();
      } else {
        displayMessage("M-Auth");
      }
    },
  },
  mounted() {
    this.loadData();
    this.loadMateriels();
    this.loadSeparateOptionInMateriels();
    this.disableCheckboxForSelectAllField();
    changeTitle(this.$route.name);
  },
};
</script>

<style scoped>
hr {
  margin: auto;
  width: 90%;
}
.h1 {
  font-size: 25px;
}
.plusBtn {
  font-size: 1.3em;
  text-align: center;
}

.close {
  position: absolute;
  top: 2%;
  right: 2%;
  float: right;
  width: 5%;
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
.modal-vue .overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.input {
  width: 100%;
  border: 2px solid #ccc;
  font-size: 10px;
  outline: none;
  padding: 2%;
  border-radius: 5px;
  font-size: 17px;
  margin: auto;
}
p {
  margin: 15px;
}
.formMaterielAdd {
  width: 70%;
  z-index: 9999;
  margin: auto;
  padding: 30px 40px;
  background-color: gainsboro;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  top: 5%;
  left: 20%;
}
.formMateriel {
  width: 40%;
  z-index: 9999;
  margin: auto;
  padding: 20px 30px;
  background-color: gainsboro;
  border-radius: 5px;
  position: absolute;
  top: 35%;
  left: 30%;
  text-align: center;
}
label {
  float: left;
}
.button {
  width: 50%;
  float: left;
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  transition: all 0.5s;
  margin-left: 0%;
  margin-top: 20px;
}
/* form p
  {
    width: 100%;
    margin: auto;
    margin-top: 15px;
  } */
/* form input,form select
{
  margin-top:2px;
  padding: 7px;
  width: 100%;
  border:2px solid #ccc;
  border-radius: 5px;
  outline: none;
} */
/* .addMateriel
{
  width: 13%;
  background-color: rgb(22, 133, 38);
  border-bottom:5px solid rgb(13, 80, 23);
  border-radius: 7px;
  font-size: 15px;
  color:whitesmoke;
  transition:all 0.5s;
  margin-left: 6%;
  margin-top: 20px;
  padding: 2px;
} */
/* .titleAddMateriel
{
  font-size: 30px;
  text-align: center;
  margin-bottom: 1%;
} */
table {
  border-collapse: collapse;
  width: 100%;
  margin: auto;
  margin-top: 20px;
}
th,
td {
  text-align: left;
  padding: 10px;
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
.containerMateriel {
  width: 100%;
  margin: 0 auto;
}
.divForm {
  display: flex;
  justify-content: space-around;
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

/*------mediaQuery--------*/
/* @media screen and (max-width: 1000px) 
  {
    .addMateriel
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
      padding: 20px;
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
    .formMaterielAdd
    {
      width:80%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      bottom: 2%;
      left:15%  
    }
  }
  @media screen and (max-width: 900px) 
  {
    .formMateriel
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
    .addMateriel
    {
      width: 20%;
      background-color: rgb(22, 133, 38);
      border-bottom:5px solid rgb(13, 80, 23);
      border-radius: 7px;
      font-size: 15px;
      color:whitesmoke;
      transition:all 0.5s;
      margin-left: 25px;
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
    .formMaterielAdd
    {
      width:78%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      top:1%;
      left:20%  
    }
  }
  @media screen and (max-width: 900px) 
  {
    .formMaterielAdd
    {
      width:82%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      top:1%;
      left:10%  
    }
  }
  @media screen and (max-width: 850px) 
  {
    .formMaterielAdd
    {
      width:90%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      top:1%;
      left:10%  
    }
  }
  @media screen and (max-width: 800px) 
  {
    .formMaterielAdd
    {
      width:90%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      top:1%;
      left:3%  
    }
  }
  @media screen and (max-width: 700px) 
  {
    .formMaterielAdd
    {
      width:95%;
      z-index: 9999;
      margin: auto;
      padding: 20px 30px;
      background-color: rgba(255, 255, 255, 1); 
      border-radius: 5px;
      position: absolute;
      top:1%;
      left:3%  
    }
    .divForm2
    {
      margin-left: 15px;      
    }
  }
  @media screen and (max-width: 650px) 
  {
    .formMateriel
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
    .formMateriel
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
    .codeMaterielInput,.designationMaterielInput
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
    .titleAddMateriel
    {
      font-size: 20px;
      margin-left: 5%;
    }
    .addMateriel
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
    .close
    {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 7%;
      height: 25px;
      color:white;
      background-color: red;
      font-size: 15px;
      border: 2px solid black;
    }
  } */

/* @media screen and (max-width: 450px) 
  {
    .formMateriel
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
    .codeMaterielInput,.designationMaterielInput
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
    .titleAddMateriel
    {
      font-size: 15px;
      margin-left: 2%;
    }
    .addMateriel
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
    .formMateriel
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
    .codeMaterielInput,.designationMaterielInput
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
    .titleAddMateriel
    {
      font-size: 15px;
      margin-left: 2%;
    }
    .addMateriel
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
    .formMateriel
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
    .codeMaterielInput,.designationMaterielInput
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
    .titleAddMateriel
    {
      font-size: 12px;
    }
    .addMateriel
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
