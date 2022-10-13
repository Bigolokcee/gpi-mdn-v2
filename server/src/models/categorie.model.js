import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorieSchema = new Schema({
  libelle: {
    type: String,
    require: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  tutelle: {
    type: Schema.Types.ObjectId,
    ref: 'Tutelle',
  },
  materiels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Materiel',
    },
  ],
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    //default: moment().format()
  },
});

const Categorie = mongoose.model('Categorie', CategorieSchema);
export default Categorie;
