import Modele from '../models/modele.modele';

async function all(req, res) {
    try {
        const data = await Modele.find({ enabled: true, ...req.query });
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
        const data = await Modele.find({ enabled: true, ...req.query });
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
        const data = await Modele.findOne({ _id: id });
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
        console.log(req.body)

        var bodyLen = Object.keys(body).length;
        if ( bodyLen === 0 ) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data:null
            });
        } else {
            const newFournisseur = new Modele(body);
            const data = await newFournisseur.save();
            res.status(201).json({
                status: 201,
                message: 'Modele created successfully!',
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
        console.log(body)

        const {  libelle } = body;
        if ( bodyLen === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const id = req.params.id;
            const data = await Modele.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Modele updated successfully!',
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
        await Modele.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Modele deleted successfully!',
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
        const data = await Modele.find({enabled: true})
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
        let res = await Modele.deleteMany();
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
    all, one, create, update, remove,deleteAll,getStatistique,findByTutelle
};