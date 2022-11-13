//import moment from 'moment';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PieceSchema = new Schema({
    libelle: {
        type: String,
        default: "Non renseigné",
        require: true
    },
    reference: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
    },
    marque: {
        type: String,
        require: true
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Modele'
    },
    numero: {
        type: Number,
        require: true
    },
    statut: {
        type: String,
        require: true,
        default: "Disponible"
    },
    fournisseur: {
        type: Schema.Types.ObjectId,
        ref: 'Fournisseur'
    },
    direction: {
        type: Schema.Types.ObjectId,
        ref: 'Direction'
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie'
    },
    fonction: {
        type: Schema.Types.ObjectId,
        ref: 'Fonction'
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
        type: [String],
        //default: moment().format()
        default: new Date().toISOString()
    }
});

const Piece = mongoose.model('Piece', PieceSchema);
export default Piece;