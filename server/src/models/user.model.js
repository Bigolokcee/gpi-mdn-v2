//import moment from 'moment';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    nom: {
        type: String,
        require: true
    },
    prenom: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: false
    },
    statut: {
        type: String,
        require: true
    },
    fonction: {
        type: String,
        require: true
    },
    direction: {
        type: Schema.Types.ObjectId,
        ref: 'Direction'
    },
    tutelle: {
        type: Schema.Types.ObjectId,
        ref: 'Tutelle'
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
});

const User = mongoose.model('User', UserSchema);
export default User;