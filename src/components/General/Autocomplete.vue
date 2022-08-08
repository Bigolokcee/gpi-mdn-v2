<template>
     <div class="field" id = "autocompleteComponent">
      <input type="search" v-model="letter" ref="autoCompleteInput" @keydown="loadAutocompleteData" :placeholder="placeholder">
      <div v-if="!openBox">
        <div class="load" v-if="letter.length > 0 || openBox == true">
          <ul>
          </ul>
            <li v-for="data,i in data" :key="i" @click="chooseOne">
              {{ data.libelle }}
              <input type="hidden" :value ="data.id" name="">
            </li>
            <li @click ="addOne" class = "hideLi" v-if="isClickable">
            <span> +</span>
            </li>
        </div>
      </div>
    </div>
</template>

<script>
export default {
     props: {
        dataSource: [],
        placeholder: String
    },
    data(){
    return {
      letter: '',
      follow: '',
      openBox: true,
      data: [],
      isClickable: false,
      autocompleteData: [],
      selectedListId: '',
    };
  },
  methods: {
      async loadAutocompleteData(e) {
      this.autocompleteData = this.dataSource;
      this.openBox = false;
      this.data = this.autocompleteData.filter( f => f.libelle.toLowerCase().includes(this.letter.toLowerCase()));
      if ( e.key === "Backspace") {
        this.data = this.autocompleteData.filter( f => f.libelle.toLowerCase().includes(this.letter.toLowerCase()));
        if ( this.letter.length === 0) {
          this.isClickable = false;
        }
      }
     if ( this.letter.length != 0 && this.data.length === 0 ) {
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
      this.getIdByEntityAndEmitThem(e,undefined)
    
    },
    addOne(e) {
      this.openBox = true;
      this.letter =  this.$refs.autoCompleteInput.value;
      this.getIdByEntityAndEmitThem(e, this.letter)
    },
    getIdByEntityAndEmitThem(e,newData){
        this.openBox = true;
        var currentEntity = this.placeholder.split(" ")[2];
        var ids = {entity: currentEntity, id:  e.path[0].firstElementChild._value, newData};
        this.$emit('selectedValue', ids)
    }
  }
}
</script>


<style scoped>
  .field {
    width: 100%;
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
  box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.67);
-webkit-box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.67);
-moz-box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.67);


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
    text-align: left;
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
</style>
