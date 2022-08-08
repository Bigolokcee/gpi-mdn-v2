//import moment from 'moment';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const TutelleSchema = new Schema({
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
        default: new Date().toISOString()
        //default: moment().format()
    },
    direction: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Direction'
        }
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    materiels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Materiel'
        }
    ],
    /* 
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }] */
});

const Tutelle = mongoose.model('Tutelle', TutelleSchema);
export default Tutelle;