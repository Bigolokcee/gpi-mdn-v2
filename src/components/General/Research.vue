<template>
  <div>
    <button @click="deleteProbleme">Problèmes</button>
    <button @click="deleteHisto">Historiques</button>
    <button @click="deleteTutelle">Tutelle</button>
    <button @click="deleteDirection">Direction</button>
    <button @click="deleteUsers">users</button>
    <button @click="deleteMateriels">Materiels</button>
    <button @click="deleteFunctions">Fonctions</button>
    <button @click="deleteFournisseurs">Fournisseurs</button>
    <button @click="deleteModeles">Modeles</button>
    <button @click="deleteCategories">Categories</button>

    <div class="carre slide-in-top"></div>

    <Select />
    <!--  <Search /> -->
    <div class="field">
      <input
        type="text"
        @keydown.enter="test"
        v-model="letter"
        ref="autoCompleteInput"
        @keydown="loadAutocompleteData"
        placeholder="Type something...."
      />
      <div v-if="!openBox">
        <div class="load" v-if="letter.length > 0 || openBox == true">
          <ul></ul>
          <li v-for="(data, i) in data" :key="i" @click="chooseOne">
            {{ data }}
            <input type="hidden" name="" />
          </li>
          <li @click="addOne" class="hideLi" v-if="isClickable">
            <span> +</span>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //import { _SERVER_URL } from '../../services/environment'
  import { toDelete } from '../../services/functions';
  // import Search from '../General/Search.vue'
  import Select from '../Formulaire/Select.vue';

  export default {
    data() {
      return {
        letter: '',
        follow: '',
        openBox: true,
        data: [],
        isClickable: false,
        autocompleteData: [
          'Ceci est',
          'Un test',
          'Wesh ma',
          'Wessh ma',
          'Geule',
        ],
      };
    },
    components: {
      Select,
    },
    /*   computed: {
    dataa() {
      this.datas = this.autocompleteData.filter((str) => {
      return str.toUpperCase().indexOf(this.letter.toUpperCase()) >= 0;
    });
      //  return this.datas = this.autocompleteData.filter( (str) => str.toUpperCase().indexOf(this.letter.toUpperCase() >= 0) );
    }
  }, */
    methods: {
      async loadAutocompleteData(e) {
        this.openBox = false;
        this.data = this.autocompleteData.filter((f) =>
          f.toLowerCase().includes(this.letter.toLowerCase())
        );
        if (e.key === 'Backspace') {
          this.data = this.autocompleteData.filter((f) =>
            f.toLowerCase().includes(this.letter.toLowerCase())
          );
          if (this.letter.length === 0) {
            this.isClickable = false;
          }
        }
        if (this.letter.length != 0 && this.data.length === 0) {
          this.isClickable = true;
        } else {
          this.isClickable = false;
        }

        //  console.log(this.datas)
      },
      chooseOne(e) {
        var selectedListValue = e.target.innerText;
        this.$refs.autoCompleteInput.value = selectedListValue;
        this.letter = e.target.innerText;

        this.openBox = true;
      },
      addOne() {
        this.openBox = true;
      },
      test() {
        console.log('enter');
      },

      async deleteProbleme() {
        var r = await toDelete('probleme');
        console.log(r.message);
      },
      async deleteHisto() {
        var r = await toDelete('historiques');
        console.log(r.message);
      },
      async deleteTutelle() {
        var r = await toDelete('tutelles');
        console.log(r.message);
      },
      async deleteDirection() {
        var r = await toDelete('directions');
        console.log(r.message);
      },
      async deleteUsers() {
        var r = await toDelete('users');
        console.log(r.message);
      },
      async deleteMateriels() {
        var r = await toDelete('materiels');
        console.log(r.message);
      },
      async deleteFunctions() {
        var r = await toDelete('fonctions');
        console.log(r.message);
      },
      async deleteFournisseurs() {
        var r = await toDelete('fournisseurs');
        console.log(r.message);
      },
      async deleteModeles() {
        var r = await toDelete('modeles');
        console.log(r.message);
      },
      async deleteCategories() {
        var r = await toDelete('categories');
        console.log(r.message);
      },
      async createUser() {},
    },
  };
</script>

<style scoped>
  .field {
    width: 20%;
    margin-top: 10px;
    padding: 5px;
  }
  .field input {
    width: 100%;
    border: none;
    border-bottom: 2px solid green;
    outline: none;
    padding: 5px;
  }
  .load {
    /* position: relative; */
    height: auto;
    background: #fff;
    width: 100%;
    box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
    -webkit-box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
  }
  .load ul {
    display: flex;
    flex-direction: row;
  }
  .load li {
    list-style-type: none;
    width: 100%;
    padding: 5px;
    margin-top: 5px;
  }
  .load li:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  .hideLi {
    text-align: center;
  }
  .hideLi span {
    font-size: 2em;
    color: #3b5998;
  }
  .active {
    animation-name: bottomToTop;
    animation-iteration-count: 1;
    animation-timing-function: ease;
  }
  @keyframes bottomToTop {
    from {
      position: relative;
      top: 15px;
    }
    to {
      position: relative;
      top: 0px;
    }
  }
  .carre {
    height: 100px;
    width: 100px;
    background-color: tomato;
    margin: 10px 0 10px 5px;
    transition: transform cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
  }
  .carre:hover {
    transform: perspective(24px);
  }
</style>
