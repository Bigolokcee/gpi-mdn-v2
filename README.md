# gpi-mdn

## Deploiement
1. Frontend : VueJS   ==> Firebase
2. Backend  : NodeJS  ==> Heroku
3. Database : MongoDB ==> MongoDB Atlas

## Admin section

1. Gerer

- Directions (crud | code, libelle)
- |-> Bureaux (crud | code, libelle)
- |-> Utilisateurs (crud | matricule, nom et prenoms, password, email, role{superadmin-admin-technicien-personel})
- Categories (crud | libelle)
- |-> Materiels (crud | reference, type, marque/model, numero, status)
- Taches
  - Recevoir des taches
  - Assigner une tache
  - Valider un diagnostic

## Utilisateur section

- Demander une intervention (crud | description)

## Technicien

- Recevoir une assignation
- Faire un diagnostic

## Code pour afficher les erreurs

displayMessage(code);

## Rule

    Première lettre de l'entité en cours (-) schema

    Ex : L'action est la suppression d'un Utilisateur
      - Entité = Utilisateur donc U et schema = Cr
      ** Code = U-Cr

## Code défini

    - Create -> Cr
    - Update -> Upd
    - Delete -> Del
    - Authentification -> Auth // Utiliser quand les coordonnées sont érronés
    - Champs vide => EmpF
