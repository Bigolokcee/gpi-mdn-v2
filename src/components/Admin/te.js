// /* Materiel 
//     Radios
//         Libelle Reference Type Materiel
//     Select
//         Type
//         Marque
//         Modele
//         Fournisseur
//         Statut
// */


// :radios="radios"
// @selectedTutelle="selectedTutelle"
// @sortByRadio = "sortByRadio"

// radios: [
//         {
//           label: "Code",
//           name: "sortByRadio",
//           value: "code",
//         },
//          {
//           label: "Designation",
//           name: "sortByRadio",
//           value: "libelle"
//         },

//       ],

//  currentTutelleValue: ''

//  sortByRadio(value){
//       console.log(value)
//       this.filteredList = this.directions.sort( (a,b) => {
//         console.log(a[value])
//         return ('' + a[value]).localeCompare(b[value]);
//         // return ('' + a[value]).localeCompare(b[value]);
//       });
//     },
//     selectedTutelle(value) {
//       this.currentTutelleValue = value
//       if (value != "") {
//         this.filteredList = this.directions.filter( f => f.tutelle._id === value )
//       } else {
//         this.filteredList = this.directions
//       }
//     },
//     filterData(value) {
//       this.filteredList = this.directions.filter(
//         (direction) => {
//           return ( ( direction.libelle.toLowerCase().includes(value.toLowerCase()) || direction.code.toLowerCase().includes(value.toLowerCase() )) && direction.tutelle._id.includes(this.currentTutelleValue)) 
//         }
//       );
//     },