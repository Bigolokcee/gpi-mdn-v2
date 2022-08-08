//import moment from 'moment';
import mongoose from 'mongoose';

//import { realDate } from '../services/functions'
const { Schema } = mongoose;

const HistoriqueSchema = new Schema({
    action: {
        type: String,
    },
    user: {
        type: String,
        default: null,
    },
    entity: {
        type: String,
        default: null
    },
    cible: {
        type: String,
        default: null
    },
    enabled: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString()
        //default: new Date().toISOString()
    },
});

const Historique = mongoose.model('Historique', HistoriqueSchema);
export default Historique;