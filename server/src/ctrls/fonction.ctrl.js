import Fonction from '../models/fonction.model';

async function all(req, res) {
  // var directionId = req.query.directionId
  // console.log(directionId)

  try {
    // var directionId = parseInt(req.body.directionId) 61939fd113ce551144aabfba
    const data = await Fonction.find({ enabled: true }).populate({
      path: 'direction',
      populate: { path: 'tutelle' },
    });
    res.status(200).json({
      status: 200,
      message: 'Liste des fonctions dans une tutelle',
      data,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

async function findByTutelle(req, res) {
  // var directionId = req.query.directionId

  try {
    // var directionId = parseInt(req.body.directionId) 61939fd113ce551144aabfba
    const data = await Fonction.find({ enabled: true, ...req.query }).populate({
      path: 'direction',
      populate: { path: 'tutelle' },
    });
    res.status(200).json({
      status: 200,
      message: 'Liste des fonctions dans une tutelle',
      data,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}
async function one(req, res) {
  try {
    const id = req.params.id;
    const data = await Fonction.findOne({ _id: id }).populate();
    res.status(200).json({
      status: 200,
      message: 'ok',
      data,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function create(req, res) {
  try {
    const body = req.body;
    var bodyLen = Object.keys(body).length;

    console.log(body);
    // const { code, libelle } = body;
    if (bodyLen === 0) {
      res.status(400).json({
        status: 400,
        message: 'Invalid data!',
        data: null,
      });
    } else {
      try {
        const newBureau = new Fonction(body);
        const data = await newBureau.save();
        res.status(201).json({
          status: 201,
          message: 'Fonction created successfully!',
          data,
        });
      } catch (e) {
        //e
        /* res.status(201).json({
                    status: 201,
                    message: 'Fonction created successfully!',
                    data: error
                }); */
      }
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
    console.log(e);
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
        data: null,
      });
    } else {
      const id = req.params.id;
      console.log(req.body);
      const data = await Fonction.updateOne({ _id: id }, body);
      res.status(201).json({
        status: 201,
        message: 'Fonction updated successfully!',
        data,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    await Fonction.updateOne(
      { _id: id },
      {
        enabled: false,
      }
    );
    res.status(201).json({
      status: 201,
      message: 'Fonction deleted successfully!',
      data: null,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function deleteAll() {
  //
  try {
    let res = await Fonction.deleteMany();
    res.status(200).json({
      status: 200,
      message: 'Data successfully delete',
      data: null,
    });
  } catch (err) {
    // console.log(err);
  }
}

export default {
  all,
  one,
  create,
  update,
  remove,
  deleteAll,
  findByTutelle,
};
