import mongoose from 'mongoose';

const { Schema } = mongoose;

const DirectionSchema = new Schema({
  code: {
    type: String,
    require: true,
  },
  libelle: {
    type: String,
    require: true,
  },
  tutelle: {
    type: Schema.Types.ObjectId,
    ref: 'Tutelle',
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    //default: moment().format()
  },
  fonctions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Fonction',
    },
  ],
  materiels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Materiel',
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Direction = mongoose.model('Direction', DirectionSchema);
export default Direction;
