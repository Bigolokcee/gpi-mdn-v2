<template>
  <div>
    <!-- entete utilisateur -->
    <SubHeader 
      entity="Utilisateur" 
      isForProblems="no" 
      isForUser: true
      nbrOfTask="2" 
      needSearchBar="yes" 
      :form="userForm" 
      :data="users"
      :isSubHeaderActive="isSubHeaderActive" 
      :selected="nbrOfTaskSelected"
      :arrayCheckbox="selectedCheckbox" 
      @showForm="showForm = true"
      @filter="filterData" :options="options" @selectedTutelle="selectedTutelle"
      @sortByRadio="sortByRadio" @sortInAlphabeticOrder="sortInAlphabeticOrder" 
      />
   
    <Loader :data="users" />
    <!-- body utilisateur -->
    <div class="containerUser">
      <!-- ajouter un utilisateur -->
      <div id="showForm" class="modal-vue ">
        <!-- <button @click="showForm = true" class="addUserButton">+</button> -->
        <div class="overlay" v-if="showForm" @click="showForm = false"></div>

        <form
          v-if="showForm"
          @submit="handleSubmit"
          @keydown.enter="handleSubmit"
          class="formUserDeleteAdd"
        >
          <button class="close" @click="showForm = false">x</button>

          <h1 class="h1">AJOUTER UN UTILISATEUR</h1>
          <!-- <div :class="isSuccess ? 'success' : 'error'" v-if="responsePost != ''">
            {{ responsePost }}
          </div> -->
          <div class="divForm">
            <div class="divForm1">
              <p>
                <input
                  class="input"
                  type="text"
                  v-model="user.nom"
                  placeholder="Nom "
                />
              </p>
              <p>
                <input
                  class="input"
                  type="text"
                  v-model="user.prenom"
                  placeholder="Prenom "
                />
              </p>
              <p>
                <input
                  class="input"
                  type="email"
                  v-model="user.email"
                  placeholder="Email"
                />
              </p>
              <p>
                <input
                  class="input"
                  type="username"
                  v-model="user.username"
                  placeholder="Nom d'utilisateur"
                />
              </p>
              <p>
                <input
                  class="input"
                  type="password"
                  v-model="user.password"
                  placeholder="Mot de passe "
                />
              </p>
              
            </div>
            <div class="divForm2">
              <p style="width:97%" v-if="userStatut === 'root'">
                <select
                  v-model="user.tutelle"
                  name="fonction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une Tutelle</option>
                  <option
                    v-for="t in tutelles.data"
                    :key="t._id"
                    :value="t._id"
                  >
                    {{ t.libelle }}</option
                  >
                </select>
              </p>
              <p style="width:97%">
                <select
                  v-model="user.fonction"
                  name="fonction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une fonction</option>
                  <option
                    v-for="b in fonctions"
                    :key="b._id"
                    :value="b.libelle"
                    >{{ b.libelle }}</option
                  >
                </select>
              </p>
              <p style="width:97%">
                <select
                  v-model="user.direction"
                  name="direction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une Structure</option>
                  <option v-for="d in directions" :key="d._id" :value="d._id">{{
                    d.libelle
                  }}</option>
                </select>
              </p>
            </div>
          </div>

          <div class="statut">
            <p v-if="userStatut === 'root'">
              <label for="root">Super Administrateur</label>
              <input
                type="radio"
                id="root"
                value="root"
                name="statut"
                class="radio"
                v-model="user.statut"
              />
            </p>
            <p>
              <label for="administrateur">Administrateur</label>
              <input
                type="radio"
                id="administrateur"
                value="administrateur"
                name="statut"
                class="radio"
                v-model="user.statut"
              />
            </p>
            <p>
              <label for="Chef Division">Chef Division</label>
              <input
                type="radio"
                id="Chef Division"
                value="chefDivision"
                name="statut"
                class="radio"
                v-model="user.statut"
              />
            </p>
            <p>
              <label for="Technicien">Technicien</label>
              <input
                type="radio"
                id="Technicien"
                value="technicien"
                name="statut"
                class="radio"
                v-model="user.statut"
              />
            </p>
            <p>
              <label for="Utilisateur">Utilisateur</label>
              <input
                type="radio"
                id="Utilisateur"
                name="statut"
                value="utilisateur"
                class="radio"
                v-model="user.statut"
              />
            </p>
          </div>

          <button class="button">Ajouter un utilisateur</button>
        </form>
      </div>

      <!-- MODIFIER UTILISATEUR -->
      <div id="modifyUser" class="modal-vue">
        <div
          class="overlay"
          v-if="modifyUser"
          @click="modifyUser = false"
        ></div>

        <form v-if="modifyUser" class="formUserDeleteAdd">
          <button class="close" @click="modifyUser = false">x</button>

          <h1 class="h1">MODIFIER UN UTILISATEUR</h1>
          <div class="divForm">
            <div class="divForm1">
              <p>
                <label for="" style="float:left;">Modifier le nom</label>
                <input class="input" type="text" v-model="oldUserValue.nom" />
              </p>
              <p>
                <label for="" style="float:left;">Modifier le prénom</label>
                <input
                  class="input"
                  type="text"
                  v-model="oldUserValue.prenom"
                />
              </p>
              <p>
                <label for="" style="float:left;">Modifier le username</label>
                <input
                  class="input"
                  type="text"
                  v-model="oldUserValue.username"
                />
              </p>
              <p>
                <label for="" style="float:left;">Modifier l'email</label>
                <input
                  class="input"
                  type="email"
                  v-model="oldUserValue.email"
                />
              </p>
              <p>
                <label for="" style="float:left;"
                  >Modifier le mot de passe</label
                >
                <input ref="password" value="" class="input" type="text" />
              </p>
            </div>
            <div class="divForm2">
              <p style="width:98%">
                <label for="" style="float:left;">Modifier une Structure</label>
                <select
                  v-model="oldUserValue.direction"
                  name="direction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une structure</option>
                  <option v-for="d in directions" :key="d._id" :value="d._id">{{
                    d.libelle
                  }}</option>
                </select>
              </p>

              <p style="width:97%" v-if="userStatut === 'root'">
                <label for="" style="float:left;">Modifier une Tutelle</label>
                <select
                  v-model="oldUserValue.tutelle"
                  name="fonction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une Tutelle</option>
                  <option
                    v-for="t in tutelles.data"
                    :key="t._id"
                    :value="t._id"
                  >
                    {{ t.libelle }}</option
                  >
                </select>
              </p>
              <p style="width:98%">
                <label for="" style="float:left;">Modifier une fonction</label>
                <select
                  v-model="oldUserValue.fonction"
                  name="fonction"
                  id=""
                  class="selectMateriel"
                >
                  <option value="">Selectionner une fonction</option>
                  <option v-for="b in fonctions" :key="b._id">{{
                    b.libelle
                  }}</option>
                </select>
              </p>
            </div>
          </div>
          <div class="statut">
            <p v-if="userStatut === 'root'">
              <label for="root">Super Administrateur</label>
              <input
                type="radio"
                id="root"
                value="root"
                name="statut"
                class="radio"
                v-model="oldUserValue.statut"
              />
            </p>
            <p>
              <label for="administrateur">Administrateur</label>
              <input
                type="radio"
                id="administrateur"
                value="administrateur"
                name="statut"
                class="radio"
                v-model="oldUserValue.statut"
              />
            </p>

            <p>
              <label for="Chef Division">Chef Division</label>
              <input
                type="radio"
                id="Chef Division"
                value="chefDivision"
                name="statut"
                class="radio"
                v-model="oldUserValue.statut"
              />
            </p>

            <p>
              <label for="Technicien">Technicien</label>
              <input
                type="radio"
                id="Technicien"
                value="technicien"
                name="statut"
                class="radio"
                v-model="oldUserValue.statut"
              />
            </p>

            <p>
              <label for="Utilisateur">Utilisateur</label>
              <input
                type="radio"
                id="Utilisateur"
                name="statut"
                value="utilisateur"
                class="radio"
                v-model="oldUserValue.statut"
              />
            </p>
          </div>
          <button class="button" @click="updateUser">
            MODIFIER UN UTILISATEUR
          </button>
        </form>
      </div>

      <!-- liste des utilisateurs -->
      <table>
        <tr>
          <th>
            <input
              type="checkbox"
              ref="checkboxForSelectAllField"
              @click="selectAll($event)"
            />
          </th>
          <th>NOM</th>
          <th>PRENOM</th>
          <th>EMAIL</th>
          <th>USERNAME</th>
          <th v-if="userStatut === 'root'">TUTELLE</th>
          <th v-if="userStatut === 'root'">STRUCTURE</th>
          <th>FONCTION</th>
          <th>STATUT</th>
          <th>ACTION</th>
        </tr>
        <tr v-for="u in filteredList" :key="u._id">
          <td>
            <input
              type="checkbox"
              @click="selectCheckbox($event)"
              name=""
              id=""
            />
            <input type="hidden" :value="u._id" name="" />
          </td>
          <td>{{ u.nom }}</td>
          <td>{{ u.prenom }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.username }}</td>
          <td v-if="userStatut === 'root'">{{ u.tutelle.libelle }}</td>
          <td v-if="userStatut === 'root'">{{ u.direction.libelle }}</td>
          <td>{{ u.fonction }}</td>
          <td>{{ u.statut }}</td>
          <td>
            <button @click="showModal(u)" class="faEdit fas fa-edit"></button>
            <button
              @click="showConfirmDelete(u)"
              class="faTrash fas fa-trash-alt"
            ></button>
          </td>
        </tr>
      </table>

      <!-- CONFIRMER LA SUPPRESSION D'UN UTILISATEUR -->
      <div id="deleteUser" class="modal-vue">
        <div
          class="overlay"
          v-if="deleteUser"
          @click="deleteUser = false"
        ></div>

        <form v-if="deleteUser" @submit="handleSubmit" class="formUserDelete">
          <button class="close" @click="deleteUser = false">x</button>
          <div>
            <p>
              <i class="fas fa-exclamation-triangle iconeDelete"></i>
            </p>
            <p for="">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </p>
          </div>
          <div>
            <button @click="deleteU" class="delete">
              Supprimer un utilisateur
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
import { getCurrentSessionUser } from "../../services/storage";
import {
  load,
  post,
  update,
  toDelete,
  displayMessage,
  isAdmin,
  alphabeticSort,
  changeTitle,
  // filtering,
} from "../../services/functions";

export default {
  components: {
    SubHeader,Loader
  },
  data() {
    return {
      nbrOfTaskSelected: 0,
      dataAndStatutCode: {},
      selectedObject: this.nbrOfTaskSelected,
      userForm: {
        placeholder: "Rechercher un utilisateur",
        plusIconeTitle: "Ajouter un utilisateur",
        class: {
          search: "fa fa-search",
          plus: "fa fa-user-plus faPlus",
        },
      },
      tutelles: [],
      selectedCheckbox: [],
      filteredList: [],
      isSubHeaderActive: false,
      openForm: false,
      isSuccess: false,
      connectedUser: getCurrentSessionUser().username,
      userStatut: getCurrentSessionUser().statut,
      user: {
        nom: "",
        prenom: "",
        username: "",
        email: "",
        password: "",
        statut: "",
        fonction: "",
        direction: "",
      },
      newUser: {
        nom: "",
        prenom: "",
        username: "",
        statut: "",
        email: "",
        fonction: "",
        direction: "",
        password: ""
      },
      oldUserValue: {
        nom: "",
        prenom: "",
        username: "",
        email: "",
        statut: "",
        fonction: "",
        direction: "",
        password: ""
      },

      responsePost: "",
      users: [],
      fonctions: [],
      directions: [],
      showForm: false,
      modifyUser: false,
      currentUserToUpdate: "",
      deleteUser: false,
      currentUser: "",
      options: [
        {
          label: "Nom",
          value: "nom",
        },
        {
          label: "Prenom",
          value: "prenom",
        },
        {
          label: "Nom d'utilisateur",
          value: "username",
        },
        {
          label: "Fonction",
          value: "libelle",
        },
      ],
      filterOptions: [
        "tutelle",
        "nom",
        "prenom",
        "username",
        "fonction",
        "statut",
      ],
      filterValue: "",
      currentTutelleValue: "",
    };
  },
  methods: {
    sortInAlphabeticOrder(value) {
      this.filteredList = alphabeticSort(this.filteredList, value);
    },
    sortByRadio(value) {
      this.filteredList = this.filteredList.sort((a, b) => {
        return ("" + a[value]).localeCompare(b[value]);
      });
    },
    selectedTutelle(value) {
      this.currentTutelleValue = value;
      if (value != "") {
        this.filteredList = this.users.filter(
          (user) =>
            user.tutelle._id === value &&
            (user.nom
              .toLowerCase()
              .trim()
              .includes(this.filterValue.toLowerCase().trim()) ||
              user.prenom
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()) ||
              user.username
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()) ||
              user.fonction
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()) ||
              user.email
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()) ||
              user.statut
                .toLowerCase()
                .trim()
                .includes(this.filterValue.toLowerCase().trim()))
        );
      } else {
        this.filteredList = this.users;
      }
    },
    filterData(value) {
      this.filterValue = value;
      this.filteredList = this.users;
      // this.filteredList = filtering(this.users,value,this.filterOptions);
      if (this.currentTutelleValue != "") {
        this.filteredList = this.users.filter((user) => {
          return (
            (user.nom
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
              user.prenom
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim()) ||
              user.username
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim()) ||
              user.fonction
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim()) ||
              user.email
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim()) ||
              user.statut
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim())) &&
            user.tutelle._id
              .toString()
              .toLowerCase()
              .trim() ===
              this.currentTutelleValue
                .toString()
                .toLowerCase()
                .trim()
          );
        });
      } else {
        this.filteredList = this.users.filter((user) => {
          return (
            user.nom
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.prenom
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.username
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.fonction
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.nom
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.email
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim()) ||
            user.statut
              .toLowerCase()
              .trim()
              .includes(value.toLowerCase().trim())
          );
        });
      }
    },
    async handleSubmit(event) {
      event.preventDefault();
      if (this.user.nom === "") {
        displayMessage("U-EmpF");
      } else {
        //Si l'utilisateur a créé est admin alors demander le mot de l'admin connecté
        if (this.user.statut == "administrateur") {
          // var permission = await isAdmin(this.connectedUser);
          // if (permission.status === 200) {
            try {
              // this.user.tutelle = getCurrentSessionUser().tutelle;
              const response = await post("users/", this.user);

              if (response.status != 201) {
                this.responsePost = response.message;
              } else {
                this.responsePost = response.message;

                displayMessage("U-Cr");
                this.user = {};
                this.loadUsers();
              }
            } catch (error) {
              // console.log(error);
              // Swal.fire("", "Something wrong, refresh the page !", "warning");
            }
          // } else {
          //   displayMessage("U-Auth");
          // }
        } else {
          //S'il n'est pas administrateur
          try {
            this.user.tutelle = getCurrentSessionUser().tutelle;
            const response = await post("users", this.user);
            if (response.status != 201) {
              this.responsePost = response.message;
            } else {
              this.responsePost = response.message;
              displayMessage("U-Cr");
              this.user = {};
              this.loadUsers();
            }
          } catch (error) {
            /*Do Nothing*/
          }
        }
      }
    },
    showModal(currentUser) {

      this.modifyUser = true;
      /* this.currentUserToUpdate = Object.assign(currentUser);
      this.oldUserValue = Object.assign(currentUser) */
      this.currentUserToUpdate = currentUser._id;
      this.oldUserValue.nom = currentUser.nom;
      this.oldUserValue.prenom = currentUser.prenom;
      this.oldUserValue.username = currentUser.username;
      this.oldUserValue.statut = currentUser.statut;
      this.oldUserValue.fonction = currentUser.fonction._id;
      this.oldUserValue.direction = currentUser.direction._id;
      this.oldUserValue.password = currentUser.password;
      this.oldUserValue.email = currentUser.email;
      
      // this.oldUserValue.tutelle = getCurrentSessionUser().tutelle;
    },
    async loadData() {
      /* Show Tutelle only if user is Root */
      // var tutelleId = getCurrentSessionUser().tutelle;
      // var directionId = getCurrentSessionUser().direction
      // const resultDirection = await load("directions?tutelleId=" + tutelleId);
      const resultDirection = await load("directions/all");
      this.directions = resultDirection.data;
      // const resultFonctions = await load("fonctions?tutelle=" + tutelleId);
      const resultFonctions = await load("fonctions/all");
      this.fonctions = resultFonctions.data;

      // this.tutelles = await load("tutelles");
    },
    async loadUsers() {
      if (this.userStatut === "root") {
        // var tutelleId = getCurrentSessionUser().tutelle;

        const resultUsers = await load("users/all");
        // this.dataAndStatutCode = resultUsers;
        this.users = resultUsers.data.filter( f => f.statut != 'root');
        this.filteredList = this.users;
      //  this.dataAndStatutCode = {data: this.users,statusCode: resultUsers.status}

      } else {
        // tutelleId = getCurrentSessionUser().tutelle;
        // const resultUsers = await load("users?tutelle=" + tutelleId);
        const resultUsers = await load("users/all");
        // this.dataAndStatutCode = resultUsers;
        this.users = resultUsers.data;
        this.filteredList = this.users;
      // this.dataAndStatutCode = {d: this.users,statusCode: resultUsers.status}

      }

      this.disableCheckboxForSelectAllField();
    },
    async deleteU(event) {
      event.preventDefault();
      var userToDelete = this.currentUser;
      console.log(userToDelete, this.currentUser)
      //Recupere l'Id de l'element selectionné grace à l'input type hidden
      if (userToDelete.statut === "administrateur" || userToDelete.statut === "root") {
        // var response = await isAdmin(this.connectedUser);
        // if (response.status == 200) {
          try {
            console.log("users/" + this.currentUser._id)
            var re = await toDelete("users/" + userToDelete._id);
            console.log(re)
            if ( userToDelete._id === getCurrentSessionUser()._id ) {
              this.$router.go(0);
            }
            displayMessage("U-Del");
            this.loadUsers();
            this.deleteUser = false;
          } catch (error) {
            /*Do nothing */
            // console.log(error)
          }
        // } else {
        //   displayMessage("U-Auth");
        // }
      } else {
        console.log("Here")
        // var permission = await isAdmin(this.connectedUser);
        var permission = {statut: 200}
        // permission.statut == 200;
        if (permission.statut == 200) {
          console.log(userToDelete._id)
          var r = await toDelete("users/" + userToDelete._id);
          console.log(r)
          displayMessage("U-Del");
          this.loadUsers();
          this.deleteUser = false;
        } else {
          displayMessage("U-Auth");
        }
      }
    },
    async updateUser(event) {
      event.preventDefault();

      this.newUser.nom = this.oldUserValue.nom;
      this.newUser.prenom = this.oldUserValue.prenom;
      this.newUser.username = this.oldUserValue.username;
      this.newUser.statut = this.oldUserValue.statut;
      this.newUser.fonction = this.oldUserValue.fonction;
      this.newUser.email = this.oldUserValue.email;
      // this.newUser.tutelle = getCurrentSessionUser().tutelle;
      this.newUser.direction = this.oldUserValue.direction;
      this.newUser.password = this.$refs.password.value;

      if (
        this.newUser.fonction == "" ||
        this.newUser.fonction == undefined ||
        this.newUser.direction == ""
      ) {
        displayMessage("U-EmpF");
      } else {
        if (this.newUser.statut == "administrateur") {
          var response = await isAdmin(this.connectedUser);
          if (response.status == 200) {
            await update("users/" + this.currentUserToUpdate, this.newUser);
            displayMessage("U-Upd");
            this.loadUsers();
          } else {
            displayMessage("U-Auth");
          }
        } else {
          await update("users/" + this.currentUserToUpdate, this.newUser);
          displayMessage("U-Upd");
          this.loadUsers();
        }
      }
    },

    showConfirmDelete(currentUserToDelete) {
      this.deleteUser = true;
      this.currentUser = currentUserToDelete;
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

      if (permission.status === 200) {
        for (var checkbox of this.selectedCheckbox) {
          await toDelete("users/" + checkbox);
        }
        displayMessage("U-Del");
        this.loadUsers();
        this.nbrOfTaskSelected = 0;
        this.isSubHeaderActive = false;
      } else {
        displayMessage("U-Auth");
      }
    },
  },

  mounted() {
    this.loadData();
    this.loadUsers();
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
.h1 {
  font-size: 25px;
}
p {
  margin: 15px;
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
.radio {
  margin-left: 15px;
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
.formUserDeleteAdd {
  width: 60%;
  z-index: 9999;
  margin: auto;
  padding: 30px 40px;
  background-color: gainsboro;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 23%;
}
.button {
  width: 30%;
  float: left;
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  transition: all 0.5s;
  margin-left: 3%;
  margin-top: 10px;
}
.formUserDelete {
  width: 40%;
  z-index: 9999;
  margin: auto;
  text-align: center;
  padding: 30px 40px;
  background-color: gainsboro;
  border-radius: 5px;
  position: absolute;
  top: 25%;
  left: 30%;
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
.statut {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: auto;
  text-align: center;
}
.statut p {
  margin: auto;
  text-align: center;
}
table {
  border-collapse: collapse;
  width: 95%;
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
.containerUser {
  width: 100%;
  margin: 0 auto;
}
.formUserDelete {
  position: absolute;
  top: 30%;
  left: 35%;
  width: 40%;
}
.divForm {
  display: flex;
  justify-content: space-around;
  margin: auto;
}
.divForm1,
.divForm2 {
  width: 90%;
}
</style>
