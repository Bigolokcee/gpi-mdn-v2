<template>
  <div class="customSelect">
    <div class="selectText" @click="isOpen = !isOpen">
      <input type="hidden" name="" />
      <label for="" ref="label">{{ defaultLabel }}</label>
      <img src="../../assets/arrowUp.png" alt="" :class="{ active: isOpen }" />
    </div>
    <ul class="options" v-if="isOpen">
      <li @click="selectLi" v-for="(option, i) in options" :key="i">
        <input type="hidden" :value="option.value" />
        {{ option.label }}
      </li>
    </ul>
    <ul class="options" v-if="isOpen && tutelles != undefined">
      <li @click="allTutelles">
        <input type="hidden" name="" />
        Toutes les tutelles
      </li>
      <li @click="selectLi" v-for="(option, i) in tutelles" :key="i">
        <input type="hidden" :value="option._id" />
        {{ option.libelle }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['options', 'tutelles', 'defaultLabel'],
    data() {
      return {
        isOpen: false,
        // options: ["Selectionner un champs","Facebook", "Insta"]
      };
    },
    methods: {
      selectLi(e) {
        if (this.tutelles === undefined) {
          this.$refs.label.innerText = e.target.innerText;
          this.isOpen = false;
          this.$emit('selectLi', e.target.firstChild.value);
        } else {
          this.$refs.label.innerText = e.target.innerText;
          this.isOpen = false;

          this.$emit('selectTutelle', e.target.firstChild.value);
        }
      },
      allTutelles(e) {
        this.$refs.label.innerText = e.target.innerText;
        this.isOpen = false;
        this.$emit('selectTutelle', e.target.firstChild.value);
      },
      openCloseSelect() {},
    },
  };
</script>

<style scoped>
  :root {
    /* --colorGreen:#469b31; */
    --colorGreen: #3b5998;
  }
  * {
    margin: 0;
    padding: 0;
  }
  .customSelect {
    position: relative;
  }
  .selectText {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
    min-width: 220px;
    border-right: 2px solid #ccc;
    background-color: inherit;
    /* border-bottom: 3px solid black; */
    padding: 5px 5px 5px 10px;

    cursor: pointer;
  }
  img {
    width: 15px;
    transition: transform ease 0.5s;
  }
  .active {
    transform: rotate(180deg);
  }
  .selectText label {
    cursor: pointer;
  }
  ul {
    width: 100%;
    position: absolute;
    z-index: 199;
    margin-top: 5px;
    border-radius: 10px;
    box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
    -webkit-box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.67);
    z-index: 10000;
  }
  li {
    list-style-type: none;
    /* background-color: rgb(rgb(241, 85, 85), rgb(126, 179, 126), blue); */
    padding: 5px 0 5px 10px;
    cursor: pointer;
    background-color: white;
  }
  li:hover {
    background-color: var(--colorGreen);
    color: white;
  }
</style>
