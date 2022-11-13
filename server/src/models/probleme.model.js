import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProblemeSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  executeBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  materiel: {
    type: [Schema.Types.ObjectId],
    default: null,
    required: false,
    ref: 'Materiel',
  },
  piece: {
    type: [Schema.Types.ObjectId],
    default: null,
    required: false,
    ref: 'Piece',
  },
  description: {
    type: String,
    require: true,
  },
  solutionPreconise: {
    type: [String],
    default: [],
  },
  statut: {
    type: String,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  tutelle: {
    type: Schema.Types.ObjectId,
    ref: 'Tutelle',
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    //default: moment.format()
  },
  endAt: {
    type: String,
    default: '',
  },
  isProgress: {
    type: Boolean,
    default: true,
  },
});

const Probleme = mongoose.model('Problem', ProblemeSchema);

export default Probleme;
