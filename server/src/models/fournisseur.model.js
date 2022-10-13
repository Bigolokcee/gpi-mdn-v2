import mongoose from 'mongoose';

const { Schema } = mongoose;

const FournisseurSchema = new Schema({
  libelle: {
    type: String,
    require: true,
  },
  telephone: {
    type: String,
    require: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  tutelle: {
    type: String,
    default: 'null',
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    //default: moment().format()
  },
});

const Fournisseur = mongoose.model('Fournisseur', FournisseurSchema);
export default Fournisseur;
