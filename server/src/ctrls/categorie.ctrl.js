import Categorie from '../models/categorie.model';

async function all(req, res) {
    try {
        const data = await Categorie.find({ enabled: true }).populate('tutelle');;
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
        const data = await Categorie.find({ enabled: true, ...req.query }).populate('tutelle');
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
        const data = await Categorie.findOne({ _id: id });
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
        const { libelle } = body;
        if ( libelle.length === 0 ) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data:null
            });
        } else {
            const newCategorie = new Categorie(body);
            const data = await newCategorie.save();
            res.status(201).json({
                status: 201,
                message: 'Categorie created successfully!',
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
    
        const {  libelle } = body;
        if ( libelle.length === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const id = req.params.id;
            const data = await Categorie.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Categorie updated successfully!',
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
        await Categorie.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Categorie deleted successfully!',
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
        const data = await Categorie.find({enabled: true})
        var t = data.length;
            res.status(201).json({
                status: 201,
                message: 'Total categories',
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
        let res = await Categorie.deleteMany();
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