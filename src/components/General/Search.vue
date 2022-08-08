<template>
   <div class="field">
       {{ dataSource }}
    <input type="text" v-model="letter" @keydown="loadAutocompleteData" :placeholder="placeholder">
    <div class="load" v-if="letter != 0">
      <ul>
      </ul>
        <li v-for="data,i in dataSource" :key="i">
          {{ dataSource }}
        </li>
        <li class = "hideLi" v-if="isClickable">
         <span>+</span>
        </li>
    </div>
  </div>

</template>

<script>
export default {
    data(){
        return {
            letter: '',
            follow: '',
            data: [],
            isClickable: false,
            autocompleteData: ["Ceci est", "Un test", "Wesh ma","Wessh ma", "Geule"],
        }
    },
    props: {
        dataSource: Array,
        placeholder: String
    },
    methods: {
    async loadAutocompleteData(e) {
        console.log(this.dataSource)
    var donnee = this.dataSource;
      this.data = this.autocompleteData.filter( f => f.toLowerCase().includes(this.letter.toLowerCase()));
      if ( e.key === "Backspace") {
        this.data = this.autocompleteData.filter( f => f.toLowerCase().includes(this.letter.toLowerCase()));
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