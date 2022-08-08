import Tutelle from '../models/tutelle.model';

async function all(req, res) {
    try {
        const data = await Tutelle.find({ enabled: true }).populate();
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
        const data = await Tutelle.findOne({ _id: id }).populate();
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
        const { code, libelle } = body;
        if (code.length === 0 || libelle.length === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const newTutelle = new Tutelle(body);
            const data = await newTutelle.save();
            res.status(201).json({
                status: 201,
                message: 'Tutelle created successfully!',
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
    try {
        const body = req.body;
        const { code, libelle } = body;
        if (code.length === 0 || libelle.length === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const id = req.params.id;
            const data = await Tutelle.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Tutelle updated successfully!',
                data
            });
        }
    } catch (e) {
       // console.log(e)
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

        await Tutelle.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Tutelle deleted successfully!',
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
        let res = await Tutelle.deleteMany();
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
    all, one, create, update, remove, deleteAll
};