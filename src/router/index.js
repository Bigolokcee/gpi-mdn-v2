import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
/* ADMIN */
import Admin from '../views/Admin.vue'
import Direction from '../components/Admin/Direction.vue';
import Fonction from '../components/Admin/Fonction.vue';
import Admin_Utilisateur from '../components/Admin/Admin_Utilisateur.vue';
import Materiel from '../components/Admin/Materiel.vue';
import Categorie from '../components/Admin/Categorie.vue';
import Home_Admin from '../components/Admin/Home.vue';
import Historique from '../components/Admin/Historique.vue';
import Statistique from '../components/Admin/Statistique.vue';
import Tache from '../components/Admin/Tache.vue';
import RouterShow from '../components/Admin/RouterShow';
import Modele from '../components/Admin/Modele';

/* --------------------- */
import Probleme from '../components/General/Probleme.vue';

/* Utilisateur */
import Utilisateur_Home from '../components/Utilisateur/Utilisateur_Home.vue';
/* --------------------- */

/* TECHNICIEN */
import Home_Tech from '../components/Technicien/Home.vue'
/* import Intervention from '../components/Technicien/Intervention.vue' */
import SuiviTache_Tech from '../components/Technicien/SuiviTache_Tech.vue'
/* --------------------- */

/* CHEF DIVISION */
import Home_CD from '../components/ChefDivision/Home.vue'
import AssignerT from '../components/ChefDivision/AssignerT.vue'
import SuiviT from '../components/ChefDivision/SuiviT.vue'
/* --------------------- */
/* GENERAL */
import Research from '../components/General/Research.vue'
import Test from '../components/General/Test.vue'

// import Tutelle from '../components/Root/Tutelle.vue'

/* ROOT */
import Dashboard from '../components/Root/Dashboard.vue'
import Fournisseur from '../components/Admin/Fournisseur.vue'




Vue.use(VueRouter)


const routes = [
  /* ADMIN */
  {
    path: '/routerShow',
    name: 'RouterShow',
    component: RouterShow

  },
  /* ROOT */
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/',
        name: 'Direction',
        component: Direction
      },
      // {
      //   path: 'tutelles',
      //   name: 'Tutelle',
      //   component: Tutelle
      // },
      {
        path: 'fonctions',
        name: 'Fonction',
        component: Fonction
      },
      {
        path: 'utilisateurs',
        name: 'Admin_Utilisateur',
        component: Admin_Utilisateur
      },
      {
        path: 'categories',
        name: 'Categorie',
        component: Categorie
      },
      // {
      //   path: '/',
      //   name: 'Tutelle',
      //   component: Tutelle
      // }, 
      {
        path: 'fournisseurs',
        name: 'Fournisseur',
        component: Fournisseur
    
      },
      {
        path: 'modeles',
        name: 'Modele',
        component: Modele
    
      },
      {
        path: "materiels",
        name: "Materiel",
        component: Materiel
      },
      {
        path: 'suiviTache',
        name: 'SuiviT',
        component: SuiviT
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: '',
        name: 'Home_Admin',
        component: Home_Admin
      },
      {
        path: 'tache',
        name: 'Tache',
        component: Tache
      },
      {
        path: 'recherche',
        name: 'Research',
        component: Research
      },
      {
        path: 'statistique',
        name: 'Statistique',
        component: Statistique
      },
      {
        path: 'directions',
        name: 'Direction',
        component: Direction
      },
      // {
      //   path: 'tutelles',
      //   name: 'Tutelle',
      //   component: Tutelle
      // },
      {
        path: 'fonctions',
        name: 'Fonction',
        component: Fonction
      },
      {
        path: 'suiviTache',
        name: 'SuiviT',
        component: SuiviT
      },
      {
        path: "utilisateurs",
        name: "Admin_Utilisateur",
        component: Admin_Utilisateur

      },
      {
        path: "historiques",
        name: "Historique",
        component: Historique

      },
      {
        path: "categories",
        name: "Categorie",
        component: Categorie
      },
      {
        path: "materiels",
        name: "Materiel",
        component: Materiel
      },
      {
        path: "fournisseurs",
        name: "Fournisseur",
        component: Fournisseur
      },
      {
        path: "modeles",
        name: "Modele",
        component: Modele
      },
      {
        path: "problemes",
        name: "Probleme",
        component: Probleme
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  /* CHEF DIVISION */
  {
    path: '/chefDivision',
    name: 'Home_CD',
    component: Home_CD,
    children: [
      {
        path: 'probleme',
        name: 'Probleme',
        component: Probleme,
      },
      {
        path: '/',
        name: 'AssignerT',
        component: AssignerT,
      },
      {
        path: 'suivi',
        name: 'SuiviT',
        component: SuiviT
      }
    ]
  },
  /* TECHNICIEN */
  {
    path: '/technicien',
    name: 'Technicien',
    component: Home_Tech,
    children: [
      {
      path: '/',    
        name: 'SuiviTache_Tech',
        component: SuiviTache_Tech,
      },
      {
        path: 'probleme',
        name: 'Probleme',
        component: Probleme,
      }/*,
       {
        path: '/',
        name: 'Intervention',
        component: Intervention,
      }, */

    ]
  },
  /* UTILISATEUR */
  {
    path: '/utilisateur',
    name: 'Utilisateur_Home',
    component: Utilisateur_Home
  },
  /* CONNEXION */
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  //Test Ticket-----------------
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  //-------------------------------

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
