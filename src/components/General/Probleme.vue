<template>
  <div>

    <!-- <div class="container-msg" v-if="isOpen">
       <span>Vous n'avez aucune opération en cours ...</span> 
       <span class="closeButton" @click="isOpen = false">X</span>
    </div> -->


    <div class="divUser">
      
      <span style="position:relative; top:20px;">DIRECTION DES SYSTEMES D'INFORMATION</span>

      <div class="containForm">

        <span>Soumettre une requête</span>

        <div
          :class="isSuccess ? 'success' : 'error'"
          v-if="responseText != ''"
          style="margin: 0 auto; width:50%; margin-bottom:10px; color:white;"
        >
          {{ responseText }} ! 
        </div>

        <!-- Liste du matériel disponible dans son bureau -->
        <p style="margin-top:30px;">
          <label for="">Choisir le matériel concerné <span style="color:red; font-size: 15px;">*</span></label><br>
          <select name="" id="" v-model="utilisateur.materiel" class="select">
            <option value="" ></option>
            <option v-for="data in materiels"  :key="data._id" :value="data._id">{{
              data.libelle
            }}</option>
          </select>
        </p>

        <form action="" class="formProblem">
          <p>
            <label for="">Motif de votre requête <span style="color:red; font-size: 15px;">*</span></label><br>
            <textarea
              name=""
              id=""
              cols="50"
              rows="15"
              v-model="utilisateur.description"
              class="problemeInput"
            ></textarea>
          </p>

          <p class="divButton">
            <button type="submit" value="" class="buttonAnnuler" @click="postProblem">
              Annuler 
            </button>
            <button type="submit" value="POSER" class="buttonPoser" @click="postProblem">
              Envoyer
            </button>
          </p>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentSessionUser } from "../../services/storage";
import { redirectIfNotLogin } from "../../services/guard";
import Swal from "sweetalert2";
import { changeTitle, displayMessage, load, post, update } from "../../services/functions";
export default {
  //sender assignedTo comeFrom problem
  data() {
    return {
      utilisateur: {
        sender: getCurrentSessionUser()._id,
        description: "",
        materiel: "",
        tutelle: getCurrentSessionUser().tutelle
      },
       isOpen: true,
      showForm: false,
      modifyPassword: false,
      user: getCurrentSessionUser(),
      responseText: false,
      description: "",
      isSuccess: false,
      materiels: [],
      userProblem: 0,
      staut: ''
    };
  },
  methods: {
    async postProblem(event) {
      event.preventDefault();
      if (
        this.utilisateur.description != "" &&
        this.utilisateur.materiel != ""
      ) {
        const data = await post("probleme", this.utilisateur);

        if (data.response === 201) {
          this.isSuccess = true;
          Swal(
            "Oops !",
            "Veuillez réessayer dans quelques instants...",
            "warning"
          );
         
        } else {
          // var statut = "Indisponible"
          await update("materiels/"+ this.utilisateur.materiel,{statut: "Indisponible"});
          Swal.fire(
            "Merci",
            "Votre demande a été envoyé avec succès.",
            "success"
          );
          this.utilisateur = {};
          this.isSuccess = false;

        }
      } else {
        //this.responseText = "Veuillez remplir tous les champs";
        displayMessage("U-EmpF");
      }
    },
    async userProblemStatut() {
      var problemByUser = await load("probleme?sender="+this.user.nom);
      this.userProblem = problemByUser.data;
    },
    async loadMaterielInUserDesk() {
      //Recharger tous le materiels présents dans le bureau
      // var tutelleId = getCurrentSessionUser().tutelle;
      const result = await load("materiels/all?statut=Disponible");
     
      this.materiels = result.data;

    },
  },
  mounted() {
    redirectIfNotLogin(this.$router);
    // this.userProblemStatut()
    Notification.requestPermission((status) => {
      console.log(status);
    });
    this.loadMaterielInUserDesk();
    changeTitle(this.$route.name)
  },
};
</script>

<style scoped>
.divUser {
  position:absolute;
  top:55%;
  left:50%;
  transform: translate(-50%, -50%);
  width:60%;
  text-align: center;
}
span{
  font-family: 'Montserrat';
  font-style: normal;
  font-weight:600;
  font-size: 20px;
  letter-spacing: -0.02em;
  text-align: center;
}
.containForm{
  border:#FFFFFF 1px solid;
  background-color: #FFFFFF;
  padding: 20px;
  margin-top: 50px;
  border-radius: 16px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.22);
}
.select {
  width: 90%;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #858C94
}
textarea{
  width: 90%;
  height: 160px;
  border-radius: 8px;
  border: 1px solid #858C94;
  padding:10px;
}
label{
  float:left;
  margin-bottom: 5px;
  font-size: 15px;
  margin-left: 5%;
}
.divButton {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  width: 90%;
}
.divButton button {
  width: 90%;
}
.buttonAnnuler{
  border:1px solid #085A03;
  padding: 10px;
  background-color: #ffffff;
  margin: 3%;
  border-radius: 5px;
}
.buttonPoser{
  border:1px solid #085A03;
  padding: 10px;
  background-color: #0a3c07;
  color: #fff;
  border-radius: 5px;
}


/* .problemeInput {
  width: 70%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
} */
/* .formProblem {
  width: 100%;
  margin: auto;
}
.button {
  width: 20%;
  padding: 10px;
}
.container-msg {
  padding: 20px;
  width: 80%;
  margin: 0 auto;
  transform: translateY(-35px);

  border-radius: 5px;
  background-color: #3b589863;
  text-align: center;
  font-family: 'Roboto', sans-serif;  
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10%;
  
}
.closeButton {
  font-size: 25px;
  cursor: pointer;
} */
</style>
