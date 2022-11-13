import Swal from 'sweetalert2';
import { _SERVER_URL } from './environment';
// import moment from 'moment';

export function getTimeElapsedSinceGettingTask(time) {
  /*   moment.locale('fr');
      var correctDateTime = time.substr(0, time.length - 1)
      return moment(correctDateTime).fromNow(); */
  // return moment(time).fromNow();
  let t = new Date(time)

  return (t.getDate() > 9 ? t.getDate() : "0"+t.getDate() )+" / "+(t.getMonth() > 9 ? t.getMonth() : "0"+t.getMonth() )+" / "+t.getFullYear()+" "+(t.getHours() > 9 ? t.getHours() : "0"+t.getHours() )+":"+(t.getMinutes() > 9 ? t.getMinutes() : "0"+t.getMinutes() )
}

export async function load(path) {
  return await fetch(_SERVER_URL + path).then((r) => r.json());
}

export async function update(path, object) {
  return await fetch(_SERVER_URL + path, {
    method: 'PUT',
    body: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((r) => r.json());
}

export async function post(path, object) {
  return await fetch(_SERVER_URL + path, {
    method: 'POST',
    body: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((r) => r.json());
}

export async function toDelete(path) {
  console.log(path);
  return await fetch(_SERVER_URL + path, {
    method: 'DELETE',
  }).then((r) => r.json());
}

export function searchInData(value, data) {
  return data.filter(
    (element) => element.libelle.includes(value) || element.code.includes(value)
  );
}

function getEntityFromCode(code) {
  const entities = [
    { name: 'Structure', code: 'D', gender: 'F' },
    { name: 'Catégorie', code: 'C', gender: 'F' },
    { name: 'Fonction', code: 'F', gender: 'F' },
    { name: 'Matériel', code: 'M', gender: 'G' },
    { name: 'Utilisateur', code: 'U', gender: 'G' },
    { name: 'Tache', code: 'T', gender: 'F' },
    { name: 'Tutelle', code: 'Tu', gender: 'F' },
    { name: 'Fournisseur', code: 'Fr', gender: 'G' },
    { name: 'Piece', code: 'P', gender: 'F' },
  ];

  let entity = Object.create(null);
  code = code.split('-');

  for (const element of entities) {
    if (element.code === code[0]) {
      entity['name'] = element.name;
      entity['code'] = code[1];
      entity['gender'] = element.gender;
    }
  }

  return entity;
}

export function displayMessage(code) {
  var message = null;
  var button = '';
  var head = '';
  var actions = [
    { button: 'success', code: 'Cr', action: 'créé' },
    { button: 'success', code: 'Upd', action: 'modifié' },
    { button: 'success', code: 'Del', action: 'supprimé' },
    { button: 'error', code: 'Err', action: 'Err' },
    { button: 'warning', code: 'EmpF', action: 'Champs vide' },
    { button: 'error', code: 'Auth', action: 'd' },
    { button: 'success', code: 'Ass', action: 'assigné' },
  ];

  var entity = getEntityFromCode(code);
  for (const act of actions) {
    if (act.code == entity.code) {
      if (entity.gender == 'F') {
        head = '';
        message = `${entity.name} ${act.action}e`;
        button = act.button;
        console.log(message);
      }
      if (entity.gender == 'G') {
        head = '';
        message = `${entity.name} ${act.action}`;
        button = act.button;
      }
      if (act.code === 'EmpF') {
        head = 'Champs vide !';
        message = 'Veuillez remplir tous les champs';
        button = act.button;
      }

      if (act.code === 'Auth') {
        head = 'Administrateur inconnu !';
        message = 'Veuillez vérifier vos coordonées';
        button = act.button;
      }
    }
  }
  return message != null ? Swal.fire(head, message, button) : undefined;
}

export async function isAdmin(username) {
  const { value: mp } = await Swal.fire({
    title: 'Mot de passe',
    input: 'password',
    inputLabel: '',
    inputPlaceholder: 'Entrer votre mot de passe',
  });

  try {
    var response = await post('users/login', {
      username: username,
      password: mp,
    });
  } catch (error) {
    /* Do Nothing */
  }

  return response;
}

export function resetObjectPropertyValueToEmpty(object) {
  var properties = Object.keys(object);
  for (let property of properties) {
    object[property] = '';
  }
}

export function validateField(object) {
  var options = [null, undefined, ''];
  var properties = Object.keys(object);

  for (let option of options) {
    for (let property of properties) {
      if (object[property] === option) {
        return 'Veuillez bien remplir tous les champs !';
      }
    }
  }
}

export function alphabeticSort(data, value) {
  var filteredData = [];
  if (value === 'croissant') {
    filteredData = data
      .sort((a, b) => {
        return ('' + a[value]).localeCompare(b[value]);
      })
      .reverse();
  } else {
    filteredData = data
      .sort((a, b) => {
        return ('' + a[value]).localeCompare(b[value]);
      })
      .reverse();
  }
  return filteredData;
}

export function filtering(data, value, options) {
  var elements = [];
  data = data.filter((element) => {
    // && element[options[0]]._id.includes(currentTutelleValue)
    for (let property of options) {
      console.log(element);
      if (
        element[property]
          .toString()
          .trim()
          .toLowerCase()
          .includes(value.toString().trim().toLowerCase())
      ) {
        elements.push(element);
      }
    }
  });
  return elements;
}
/* 
 export function filteringBySelectInput(data,currentTutelleValue,value,options) {
    //  && filtering(data,value,options,currentTutelleValue)
    if (value != "") {
      return data.filter( f => f.tutelle._id === value )
    } else {
      this.filteredList = this.fonctions
    }
    return 'ing'
 } */

/* 
 function filtering(data,value,options) {
   var elements = [];
   data = data.filter( element  => {
       for ( let property of options ) {
           if ( element[property].toString().trim().toLowerCase().includes( value.toString().trim().toLowerCase() )) {
            elements.push(element)
           }
       }
   });
   return elements;
}
var options = ["nom", "prenom","age"];
var data = [
    {
        nom: 'LINGUE',
        prenom: 'Konan Christian',
        age: 19
    },
    {
        nom: 'HESSOU ',
        prenom: 'Yao Junior',
        age: 12
    },
]
var value = "g";

var result = filtering(data,value,options)
console.log("LIBELLE	REFERENCE	TYPE	MARQUE	MODEL	NUMERO	FOURNISSEUR	CATEGORIE	STATUT	ACTIONS".toLowerCase().trim())

 */

/* function getTitle(vm) {
    const {title} = vm.$options;
    console.log(this.$options)
    if ( title ) {
        return typeof title === 'function' ? title.call(vm) : title;
    }
}
 */

export function changeTitle(name) {
  document.title = `MDN-${name}`;
}
