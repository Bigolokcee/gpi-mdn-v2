import Fournisseur from '../models/fournisseur.model';

async function all(req, res) {
    try {
        const data = await Fournisseur.find({ enabled: true });
        res.status(200).json({
            status: 200,
            message: 'ok',
            data
        });
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}
async function findByTutelle(req, res) {
    try {
        const data = await Fournisseur.find({ enabled: true, ...req.query });
        res.status(200).json({
            status: 200,
            message: 'ok',
            data
        });
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}

async function one(req, res) {
    try {
        const id = req.params.id;
        const data = await Fournisseur.findOne({ _id: id });
        res.status(200).json({
            status: 200,
            message: 'ok',
            data
        });
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}

async function create(req, res) {
    try {
        const body = req.body;
        console.log("Fournisseur",body)
        var bodyLen = Object.keys(body).length;
        if ( bodyLen === 0 ) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data:null
            });
        } else {
            const newFournisseur = new Fournisseur(body);
            const data = await newFournisseur.save();
            res.status(201).json({
                status: 201,
                message: 'Fournisseur created successfully!',
                data
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}

async function update(req, res) {
    //console.log( req.params.id )
    try {
        const body = req.body;
        var bodyLen = Object.keys(body).length;

        const {  libelle } = body;
        if ( bodyLen === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const id = req.params.id;
            const data = await Fournisseur.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Fournisseur updated successfully!',
                data
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}

async function remove(req, res) {
    try {
        const id = req.params.id;
        await Fournisseur.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Fournisseur deleted successfully!',
            data: null
        });
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
    }
}

async function getStatistique(req, res) {
    try {
        const data = await Fournisseur.find({enabled: true})
        var t = data.length;
            res.status(201).json({
                status: 201,
                message: 'Total fournisseur',
                data: t
            });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
        });
    }
}
async function deleteAll() {
    //
    try {
        let res = await Fournisseur.deleteMany();
        res.status(200).json({
            status: 200,
            message: "Data successfully delete",
            data: null
        });
    } catch (err) {
       // console.log(err);
    }
}


export default {
    all, one, create, update,deleteAll, remove, getStatistique,findByTutelle
};