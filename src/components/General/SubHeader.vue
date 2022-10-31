<template>
  <div class="main2">
    <!--     {{ closeTrierBy() }} -->
    <!-- L'entête -->
    <div
      v-if="!isSubHeaderActive"
      :class="{ fadeOut: !isSubHeaderActive }"
      style="height: 50px"
    >
      <div class="headertask">
        <a href="">
          <h1>{{ entity.toUpperCase() }}</h1>
        </a>
        <div class="recherche" v-if="needSearchBar">
          <span
            class="spanSearch"
            title="Effectuer une recherche"
            @click="showInputSearchF()"
          >
            <i class="fas fa-search iconSearch" style="color: white"></i>
          </span>
          <input
            type="search"
            v-model="search"
            @keypress.enter="filteredT"
            :placeholder="form.placeholder"
            @keyup="filteredT"
          />
        </div>

        <div class="divBtnTrieAndAdd dropdown">
          <button @click="isOpen = !isOpen" class="dropbtn">Trier</button>
        </div>
        <!-- <div class="divBtnTrieAndAdd dropdown">
           <img :src="require(`../../assets/${url}`)" class="swing-in-top-fwd">
            <img :src="require(`../../assets/${url}`)" class="swing-in-top-fwd">
          <button @click ="showExportOptions = !showExportOptions" class="dropbtn">Exporter</button>
        </div> -->
        <div
          class="divBtnTrieAndAdd"
          v-if="connectedUserStatut === 'root'"
        ></div>
        <div class="divBtnTrieAndAdd">
          <i
            @click="showFormF"
            v-if="
              isForProblems === false ||
              isForUser == false ||
              connectedUserStatut != 'root'
            "
            :title="form.plusIconeTitle"
            :class="form.class.plus"
          ></i>
        </div>

        <div class="nbrTask">
          <span
            v-if="isForProblems == 'yes'"
            style="font-weight: bold; color: rgb(120, 124, 119)"
            >{{ nbrOfTask }} Tâches</span
          >
        </div>
      </div>
    </div>

    <!-- Bloc de Suppression multiple des éléments -->
    <div
      v-if="isSubHeaderActive && isForProblems == 'no'"
      :class="{ fadeIn: isSubHeaderActive }"
      style="height: 50px"
    >
      <div v-if="isSubHeaderActive && isForProblems == 'no'" class="headertask">
        <div class="nbrSelect">
          <span class="iconeClose">
            <i class="fas fa-times"></i>
          </span>
          <span style="margin-left: 10%"> {{ selected }} Sélectionnés </span>
        </div>
        <div class="btnSelected">
          <input
            @click="unSelect()"
            type="button"
            class="btnCancelAndDelete"
            value="Annuler"
          />
          <input
            @click="deleteSelectedElement()"
            type="button"
            class="btnCancelAndDelete"
            value="Supprimer"
          />
        </div>
      </div>
    </div>
    <!--  v-model="tutelleSort" @change="selectedTutelle" -->

    <hr />
    <div
      class="sortContainer"
      v-if="isOpen"
      :class="{ 'swing-in-top-fwd': isOpen }"
    >
      <Select
        @selectLi="selectFilter"
        :options="options"
        defaultLabel="Trier selon un attribut"
      />
      <!-- <Select
        v-if="connectedUserStatut == 'root'"
        @selectTutelle="selectedTutelle"
        :tutelles="tutelles"
        defaultLabel="Trier selon une tutelle"
      /> -->
      <!-- <Select
        @selectLi="selectFilter"
        :materielOptions="options"
        defaultLabel="Trier selon un attribut"
        v-if="materiel"
      /> -->
      <div class="sortAlphabetic">
        <img
          :src="require(`../../assets/${url}`)"
          @click="sortInAlphabeticOrder"
          class="swing-in-top-fwd"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { load } from '../../services/functions';
  import { getCurrentSessionUser } from '../../services/storage';
  import Select from '../Formulaire/Select.vue';
  export default {
    components: {
      Select,
    },
    data() {
      return {
        search: '',
        url: 'sortAZ.png',
        isOpen: false,
        showForm: true,
        filteredData: [],
        nbrOfTaskSelected: 0,
        connectedUserStatut: getCurrentSessionUser().statut,
        tutelles: [],
        sort: '',
        tutelleSort: '',
        searchByCheckbox: '',
        showExportOptions: false,
      };
    },
    toSortOut: ['Tutelle'],
    props: [
      'options',
      'entity',
      'isForProblems',
      'nbrOfTask',
      'needSearchBar',
      'radios',
      'checkboxes',
      'form',
      'data',
      'isSubHeaderActive',
      'selected',
      'arrayCheckbox',
      'isForUser',
      'materiel',
    ],
    methods: {
      sortInAlphabeticOrder() {
        if (this.url == 'sortZA.png') {
          this.url = 'sortAZ.png';
          this.$emit('sortInAlphabeticOrder', 'croissant');
        } else {
          this.url = 'sortZA.png';
          this.$emit('sortInAlphabeticOrder', 'decroissant');
        }
      },
      selectFilter(value) {
        this.$emit('sortByRadio', value);
      },
      sorting() {
        // console.log(this.sort)
        this.$emit('sort');
      },
      sortByRadio(e) {
        var label = e.target.parentElement.firstChild.value;
        this.$emit('sortByRadio', label);
      },
      sortByCheckbox() {
        this.$emit('sortByCheckbox', this.searchByCheckbox);
      },
      trierBy() {
        //  document.getElementById("myDropdown").classList.toggle("show");
      },
      updateNbrOfTask(value) {
        this.$on('updateProps', function (msg) {
          console.log(msg);
        });
        this.$emit('test', 'hi');
        this.$emit('updateChildProps');
        this.nbrOfTask = value;
      },
      filteredT() {
        this.$emit('filter', this.search);
      },
      filtered() {
        this.filteredP = this.data.filter(
          (d) =>
            d.libelle.includes(this.search.toLowerCase()) ||
            d.code.includes(this.search.toLowerCase())
        );
        return this.filteredP;
      },
      showFormF() {
        this.$emit('showForm');
      },
      showSubHeading() {
        this.$emit('showSubHeading', this.isSubHeaderActive);
      },
      unSelect() {
        // var checkboxes = document.querySelectorAll("table input[type = 'checkbox']");
        this.$parent.unSelect();
      },
      deleteSelectedElement() {
        this.$parent.deleteSelectedElement();
      },
      async loadData() {
        var tutelles = await load('tutelles');
        this.tutelles = tutelles.data;
      },
      selectedTutelle(value) {
        this.$emit('selectedTutelle', value);
        // console.log(this.tutelleSort)
      },
    },
    mounted() {
      this.loadData();
      this.sorting();
    },
  };
</script>

<style scoped>
  :root {
    /* --colorGreen:#469b31; */
    --colorGreen: #3b5998;
  }
  .headertask {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .headertask a {
    text-decoration: none;
  }
  h1 {
    cursor: pointer;
    font-size: 30px;
  }

  .recherche {
    display: flex;
    width: 40%;
    transform: translateX(15px);
  }
  .recherche input {
    width: 100%;
    outline: none;
    padding: 5px;
    border: #ccc 1px solid;
    border-radius: 0px 10px 10px 0px;
    background-color: whitesmoke;
  }
  .iconSearch {
    padding: 10px 6px 10px 10px;
  }
  .spanSearch {
    background-color: var(--colorGreen);
    border-radius: 10px 0px 0px 10px;
  }
  .divBtnTrieAndAdd {
    position: relative;
    left: 60px;
    width: 20%;
    transform: translateX(-25px);
    display: flex;
    justify-content: space-between;
  }

  /*partie selections faites */
  .nbrSelect {
    font-size: 25px;
    transform: translateX(55px);
    width: 30%;
  }
  .btnSelected {
    width: 15%;
    transform: translateX(-55px);
    display: flex;
    justify-content: space-between;
  }
  .btnCancelAndDelete {
    padding: 5px 10px 5px 10px;
    background-color: white;
    color: blue;
    border: #ccc 1px solid;
    border-radius: 5px;
  }
  .btnCancelAndDelete:hover {
    background-color: rgba(0, 0, 255, 0.05);
  }
  .iconeClose {
    cursor: pointer;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .fadeOut {
    animation-name: fadeOut;
    animation-duration: 0.5s;
    animation-timing-function: ease-in;
  }
  @keyframes fadeOut {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .fadeIn {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-in;
  }

  /* DropDown */
  .dropbtn {
    padding: 8px;
    border: none;
    cursor: pointer;
    background-color: white;
    color: blue;
    border: #ccc 1px solid;
    border-radius: 5px;
  }

  /* Dropdown button on hover & focus */
  .dropbtn:hover {
    background-color: rgba(0, 0, 255, 0.05);
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
  }

  /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
  .show {
    display: block;
  }

  /* sortOptionsBloc */
  .sortOptionsBloc {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .sort input[type='checkbox'] {
    cursor: pointer;
  }

  /* SortContainer */
  .sortContainer {
    margin: auto;
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    margin-top: 5px;
    /* justify-items: center; */
  }
  .sortAlphabetic {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    justify-items: center;
    min-width: 100px;
  }
  .sortAlphabetic img {
    cursor: pointer;
  }

  .slide-in-top {
    animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes slide-in-top {
    0% {
      transform: translateY(-1000px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .swing-in-top-fwd {
    animation: swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
      both;
  }

  @keyframes swing-in-top-fwd {
    0% {
      transform: rotateX(-100deg);
      transform-origin: top;
      opacity: 0;
    }
    100% {
      transform: rotateX(0deg);
      transform-origin: top;
      opacity: 1;
    }
  }
  .swing-bottom-fwd {
    animation: swing-bottom-fwd 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes swing-bottom-fwd {
    0% {
      transform: rotateX(0);
      transform-origin: bottom;
    }
    100% {
      transform: rotateX(-180deg);
      transform-origin: bottom;
    }
  }

  .swing-top-bck {
    animation: swing-top-bck 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes swing-top-bck {
    0% {
      transform: rotateX(0);
      transform-origin: top;
    }
    100% {
      transform: rotateX(-180deg);
      transform-origin: top;
    }
  }
</style>
