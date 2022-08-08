import Materiel from '../models/materiel.model';

async function all(req, res) {
    console.log('here')
    try {
        var status = req.query.status;
        if (status != undefined) {
            const data = await Materiel.find({ enabled: true, ...req.query }).populate('tutelle').populate('categorie').populate('fonction').populate("fournisseur").populate("model").populate('direction');
            res.status(200).json({
                status: 200,
                message: 'Materiel  insdisponible',
                data
            });
        } else {
            console.log('OKay')
            const data = await Materiel.find({ enabled: true }).populate('tutelle').populate('fonction').populate('categorie').populate("model").populate("fournisseur").populate('direction');;
            res.status(200).json({
                status: 200,
                message: 'Liste du matériel',
                data
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });

        console.log(e)
    }
}
async function findByTutelle(req, res) {
    try {

        var status = req.query.status;
        if (status != undefined) {
            const data = await Materiel.find({ enabled: true,...req.query }).populate('tutelle').populate('categorie').populate('fonction').populate("fournisseur").populate("model").populate('direction');;
            res.status(200).json({
                status: 200,
                message: 'Materiel  insdisponible',
                data
            });
        } else {
            const data = await Materiel.find({ enabled: true,...req.query }).populate('tutelle').populate('fonction').populate('categorie').populate("model").populate("fournisseur").populate('direction');;
            res.status(200).json({
                status: 200,
                message: 'Liste du matériel',
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

async function one(req, res) {
    try {
        const id = req.params.id;
        const data = await Materiel.findOne({ _id: id });
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
        var bodyLen = Object.keys(body).length;

        // console.log( body  )
        //var error = checkAuthorizedValue([libelle, reference, type, marque, model, numero, statut, fonction, categorie])

        if (bodyLen === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const newMateriel = new Materiel(body);
            const data = await newMateriel.save();

            res.status(201).json({
                status: 201,
                message: 'Materiel created successfully!',
                data
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
        console.log( e )
    }
}

async function update(req, res) {
    try {
        const body = req.body;
        var bodyLen = Object.keys(body).length;
        // const { libelle, status } = body;
        if (bodyLen ===  0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        }
        else {
            const id = req.params.id;
            // console.log(body)
            const data = await Materiel.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Materiel updated successfully!',
                data
            });
           
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: e
        });
        console.log(e)
    }
}

async function remove(req, res) {
    try {
        const id = req.params.id;
        await Materiel.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Materiel deleted successfully!',
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
async function deleteAll() {
    //
    try {
        let res = await Materiel.deleteMany();
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
    all, one, create, update, remove,deleteAll,findByTutelle
};