import mongoose from 'mongoose';
//import moment from 'moment'

const { Schema } = mongoose;

const ModeleSchema = new Schema({
    libelle: {
        type: String,
        require: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    tutelle: {
        type: String,
        default: ""
    },
    createdAt: {
        type: String,
        default: new Date().toISOString()
        //default: moment().format()
    }

});

const Modele = mongoose.model('Modele', ModeleSchema);
export default Modele;