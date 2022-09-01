<template>
  <div class="containBigAll">
    <div class="containerAll">
      <div class="containLogoAndText">
        <div>
          <img src="../assets/mdn.png" alt="" />
        </div>

        <span class="mdn">Ministère de la Défense Nationale</span>
      </div>

      <form>
        <div v-if="error != ''" class="loginError" style="">
          {{ error }}
        </div>

        <div style="margin-top:20px">
          <label for="">Identifiant</label><br />
          <input
            v-model="username"
            name="username"
            type="username"
            class="inputField"
          />
        </div>

        <div style="margin-top:20px">
          <div class="passwordInputHead">
            <label for="">Mot de Passe</label>
            <span class="passwordForget">Mot de passe oublié ?</span>
          </div>
          <input v-model="pwd" type="password" name="pwd" class="inputField" />
        </div>

        <div>
          <button @click="login" class="button">Se connecter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
  // import { _SERVER_URL } from "../services/environment";
  import {
    changeTitle,
    displayMessage,
    load,
    post,
  } from '../services/functions';
  import { setCurrentSessionUser } from '../services/storage';

  export default {
    name: 'Login',
    data() {
      return {
        title: 'Connexion',
        username: '',
        pwd: '',
        error: '',
        users: [],
        user: {
          nom: '',
          prenom: '',
          username: '',
          password: '',
          email: '',
        },
      };
    },
    methods: {
      async login(event) {
        event.preventDefault();

        //Before redirect user, Check his data
        if (this.username === '' || this.pwd === '') {
          this.error = ' Veuillez remplir tous les champs ! ';
        } else {
          const response = await post('users/login', {
            username: this.username,
            password: this.pwd,
          });

          if (response.status === 200) {
            setCurrentSessionUser(response.data);

            switch (response.data.statut) {
              case 'root':
                this.$router.push('/dashboard');
                break;
              case 'administrateur':
                this.$router.push('/admin');
                break;
              case 'chefDivision':
                this.$router.push('/chefDivision');
                break;
              case 'technicien':
                this.$router.push('/technicien');
                break;
              case 'utilisateur':
                this.$router.push('/utilisateur');
                break;
            }
          } else {
            Swal.fire(
              'Utilisateur inconnu',
              "Echec de l'authentification",
              'error'
            );
          }
        }
      },
      async handleSubmit(event) {
        event.preventDefault();
        if (this.user.nom === '') {
          displayMessage('U-EmpF');
        } else {
          try {
            // this.user.statut = 'root'
            this.user.statut = 'administrateur';
            const response = await post('users/', this.user);
            console.log(response.message);
            if (response.status != 201) {
              this.responsePost = response.message;
            } else {
              this.responsePost = response.message;
              displayMessage('U-Cr');
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
        var users = await load('users/all');
        // var users = await load("users/all?statut=root");
        this.users = users.data;
        console.log(this.users);
      },
    },
    created() {
      // currentTitle(this)
      // this.changeTilte()
    },
    mounted() {
      changeTitle(this.$route.name);
      this.loadUsers();
    },
  };
</script>

<style lang="scss" scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .containBigAll {
    position: relative;
    height: 100vh;
    background: url("../assets/image 1.png") 
  }
  .containerAll {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
  }
  .containLogoAndText {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  img {
    width: 150px;
    margin-bottom: 8%;
  }
  .mdn {
    max-width: 500px;
    width: 297px;
    height: 80px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    letter-spacing: -0.475302px;
    color: #032d23;
    margin-bottom: 8%;
  }
  form {
    background: #ffffff;
    box-shadow: 0px 15px 60px rgba(0, 0, 0, 0.12);
    border-radius: 16px;
    padding: 35px;
    width: 100%;
  }
  div label {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 140%;
    color: #000000;
  }
  div input {
    background: #ffffff;
    border: 1px solid #858c94;
    border-radius: 8px;
    padding: 12px 16px;
    width: 100%;
    margin-top: 8px;
  }
  div .button {
    width: 100%;
    margin-top: 25px;
    background: #085a03;
    border-radius: 5.94128px;
    padding: 10.3972px;
    text-align: center;
    color: #fff;
  }
  .loginError {
    text-align: center;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    color: #07294d;
  }
  .passwordInputHead{
    display: flex;
    justify-content: space-between;
  }
  .passwordForget{
    color:#085A03;
    text-decoration: underline;
    font-weight: bold;
  }
</style>
