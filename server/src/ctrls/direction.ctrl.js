import Direction from '../models/direction.model';

async function all(req, res) {
    try {
        const data = await Direction.find({ enabled: true }).populate('tutelle');
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
   var tutelle = req.query.tutelleId;
    try {
        const data = await Direction.find({ enabled: true, tutelle }).populate('tutelle');
        res.status(200).json({
            status: 200,
            message: 'Liste des directions dans une tutelle',
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
        const data = await Direction.findOne({ _id: id }).populate('tutelle');
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
            // console.log(body)
            const newDirection = new Direction(body);
            const data = await newDirection.save();
            res.status(201).json({
                status: 201,
                message: 'Direction created successfully!',
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
        var bodyLen = Object.keys(body).length;
        if (bodyLen === 0) {
            res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            });
        } else {
            const id = req.params.id;
            const data = await Direction.updateOne({ _id: id }, body);
            res.status(201).json({
                status: 201,
                message: 'Direction updated successfully!',
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
        console.log(e)
    }
}

async function remove(req, res) {
    try {
        const id = req.params.id;

        await Direction.updateOne({ _id: id }, {
            enabled: false
        });
        res.status(201).json({
            status: 201,
            message: 'Direction deleted successfully!',
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
        let res = await Direction.deleteMany();
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
    all, one, create, update, remove,deleteAll, findByTutelle
};