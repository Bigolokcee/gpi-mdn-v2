<template>
  <div>
    <h3 class="title">{{ title }}</h3>
    <form>
      <img src="../assets/mdn.png" alt="" /><br />

      <div class="divContainerInput">
        <div v-if="error != ''" class="loginError" style="">
          {{ error }}
        </div>
        <div class="containerInput">
          <input
            v-model="username"
            name="username"
            type="username"
            class="inputField"
            placeholder="Nom d'Utilisateur ou Email"
          />
          <i class="fa fa-user icon"></i>
        </div>
        <div class="containerInput">
          <input
            v-model="pwd"
            type="password"
            name="pwd"
            class="inputField"
            placeholder="Mot de Passe"
          />
          <i class="fas fa-lock icon"></i>
        </div>
        <div>
          <button @click="login" class="button">CONNEXION</button>
        </div>
      </div>

      <!-- <div  class="overlay" >
        <form
          @submit="handleSubmit"
          @keydown.enter="handleSubmit"
          class="formUserDeleteAdd"
        >
          <h1 class="h1">CREER UN SUPER ADMINISTRATEUR</h1>
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
                  type="password"
                  v-model="user.password"
                  placeholder="Mot de passe "
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
            </div>
          </div>
          <button class="button">Ajouter le super Administrateur</button>
        </form>
      </div> -->
    </form>
  </div>
</template>


<script>
import Swal from 'sweetalert2';
// import { _SERVER_URL } from "../services/environment";
import {  changeTitle, displayMessage, load, post } from '../services/functions';
import { setCurrentSessionUser } from "../services/storage";

export default {
  name: "Login",
  data() {
    return {
      title: "Connexion",
      username: "",
      pwd: "",
      error: "",
      users:[],
       user: {
        nom: "",
        prenom: "",
        username: "",
        password: "",
        email: ""
      },
    };
  },
  methods: {
    async login(event) {
      event.preventDefault();

      //Before redirect user, Check his data
      if (this.username === "" || this.pwd === "") {
        this.error = " Veuillez remplir tous les champs ! ";
      } else {
        const response = await post("users/login",{ username: this.username, password: this.pwd })

        if (response.status === 200) {
        
          setCurrentSessionUser(response.data);

          switch (response.data.statut) {
             case "root":
              this.$router.push("/dashboard");
              break;
            case "administrateur":
              this.$router.push("/admin");
              break;
            case "chefDivision":
              this.$router.push("/chefDivision");
              break;
            case "technicien":
              this.$router.push("/technicien");
              break;
            case "utilisateur":
              this.$router.push("/utilisateur");
              break;
          }
        } else {
          Swal.fire("Utilisateur inconnu","Echec de l'authentification", "error")
        }
      }
    },
     async handleSubmit(event) {
      event.preventDefault();
      if (this.user.nom === "") {
        displayMessage("U-EmpF");
      } else {
        try {
          // this.user.statut = 'root'
          this.user.statut = 'administrateur'
          const response = await post("users/", this.user);
          console.log(response.message)
          if (response.status != 201) {
            this.responsePost = response.message;
          } else {
            this.responsePost = response.message;
            displayMessage("U-Cr");
            this.$router.go;
            this.user = {};
          }
        } catch (error) {
          // console.log(error);
        }
      }
    },
    checkUserData() {},
    async loadUsers() {
      var users = await load("users/all");
      // var users = await load("users/all?statut=root");
      this.users = users.data;
      console.log(this.users)
    }  
  },
  created() {
    // currentTitle(this)
    // this.changeTilte()
  },
  mounted() {
    changeTitle(this.$route.name)
    this.loadUsers()
  }
  
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.title {
  background-color: var(--colorGreen);
  padding: 1%;
  text-align: center;
  font-size: 40px;
  letter-spacing: 10px;
  color: white;
  text-transform: uppercase;
  font-weight: 800;
}
form {
  width: 75%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
form img {
  width: 250px;
}
.divContainerInput {
  border: 1px solid rgb(238, 235, 235);
  border-radius: 5px;
  transform: scale(1.05);
  box-shadow: 0px 0px 13px 0px rgba(226, 221, 221, 0.5);
  -webkit-box-shadow: 0px 0px 13px 0px rgba(182, 177, 177, 0.5);
  -moz-box-shadow: 0px 0px 13px 0px rgba(182, 177, 177, 0.5);
  padding: 40px;
  margin: auto;
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
.containerInput {
  display: flex;
  width: 100%;
  margin-bottom: 5%;
}
.inputField {
  width: 100%;
  padding: 10px;
  outline: none;
  border: 1px #ccc solid;
  border-radius: 3px 0px 0px 3px;
  font-size: 15px;
}
.icon {
  padding: 10px;
  background: var(--colorGreen);
  color: white;
  min-width: 50px;
  text-align: center;
}
.button {
  float: left;
  padding: 5px;
  width: 40%;
}
.loginError {
  padding: 1%;
  font-size: 15px;
  background-color: red;
  color: white;
  margin: 5px;
}

/* FORM */

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
.formUserDeleteAdd {
  width: 60%;
  // z-index: 999o9;
  margin: auto;
  padding: 30px 40px;
  background-color: gainsboro;
  text-align: center;
  border-radius: 5px;
  // position: absolute;
  /* top: 20%;
  left: 23%; */
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


/*responsive design */

@media screen and (max-width: 950px) {
  .emailInputLogin,
  .passwordInputLogin {
    width: 90%;
    position: relative;
  }
  .faEnvelope {
    position: relative;
    font-size: 30px;
    color: rgb(133, 127, 127);
  }
  .faKey {
    position: relative;
    font-size: 30px;
    color: rgb(133, 127, 127);
  }
  .logo {
    width: 100%;
    height: 130px;
    margin: auto;
    text-align: center;
  }
  .loginButton {
    width: 30%;
    padding: 10px;
    margin-top: 20px;
    margin-right: 65%;
  }
}
@media screen and (max-width: 850px) {
  .emailInputLogin,
  .passwordInputLogin {
    width: 80%;
    border: 2px solid gray;
    padding: 10px;
    font-size: 15px;
    outline: none;
    margin-top: 30px;
    border-radius: 10px;
    font-size: 20px;
    box-sizing: border-box;
  }
  .logo {
    width: 80%;
    height: 150px;
    margin: auto;
  }
  .faEnvelope {
    position: relative;
    left: -40px;
    font-size: 25px;
    color: rgb(133, 127, 127);
  }
  .faKey {
    position: relative;
    left: -40px;
    font-size: 25px;
    color: rgb(133, 127, 127);
  }
  .loginButton {
    width: 35%;
    padding: 10px;
    margin-top: 20px;
    margin-right: 50%;
  }
}
@media screen and (max-width: 700px) {
  .emailInputLogin,
  .passwordInputLogin {
    width: 80%;
    border: 2px solid gray;
    padding: 10px;
    font-size: 10px;
    outline: none;
    margin-top: 30px;
    border-radius: 10px;
    font-size: 20px;
    box-sizing: border-box;
  }
  .faEnvelope {
    position: relative;

    font-size: 25px;
    color: rgb(133, 127, 127);
  }
  .faKey {
    position: relative;

    font-size: 25px;
    color: rgb(133, 127, 127);
  }

  .containerLogin {
    width: 75%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
}
@media screen and (max-width: 400px) {
  .emailInputLogin,
  .passwordInputLogin {
    font-size: 17px;
  }
  /*  .loginButton
        {
            margin-top:25px;
            margin-left: 20px;
            padding: 5px;
            width: 50%; 
            background-color: green;
            color: white;
            font-size: 15px;
            cursor: pointer;
        } */
  .faEnvelope {
    position: relative;
    left: -30px;
    font-size: 20px;
    color: rgb(133, 127, 127);
  }
  .faKey {
    position: relative;
    left: -30px;
    font-size: 20px;
    color: rgb(133, 127, 127);
  }
  .title {
    background-color: rgb(13, 87, 24);
    padding: 3%;
    text-align: center;
    font-size: 20px;
    color: white;
    text-transform: uppercase;
  }
  .logo {
    width: 70%;
    height: 100px;
    margin: auto;
    text-align: center;
  }
}
</style>