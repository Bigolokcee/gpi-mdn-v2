//import moment from 'moment';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const FonctionSchema = new Schema({
    code: {
        type: String,
        require: true
    },
    libelle: {
        type: String,
        require: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String,
        //default: moment().format()
        default: new Date().toISOString()
    },
    direction: {
        type: Schema.Types.ObjectId,
        ref: 'Direction'
    },
    tutelle: {
        type: Schema.Types.ObjectId,
        ref: 'Tutelle'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    materiels: [{
        type: Schema.Types.ObjectId,
        ref: 'Materiel'
    }],
});

const Fonction = mongoose.model('Fonction', FonctionSchema);
export default Fonction;