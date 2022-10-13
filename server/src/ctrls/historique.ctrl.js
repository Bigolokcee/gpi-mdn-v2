import Historique from '../models/historique.model';

async function all(req, res) {
  try {
    const data = await Historique.find({ enabled: true });
    res.status(200).json({
      status: 200,
      message: 'ok',
      data,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
    // console.log(e)
  }
}

async function one(req, res) {
  try {
    const id = req.params.id;
    const data = await Historique.findOne({ _id: id }).populate('user');
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
    //const { code, libelle } = body;
    /*             res.status(400).json({
                status: 400,
                message: 'Invalid data!',
                data: null
            }); */

    // console.log("Données :", req.body)

    const newHistorique = new Historique(body);
    const data = await newHistorique.save();
    res.status(201).json({
      status: 201,
      message: 'Historique created successfully!',
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

async function deleteAll() {
  //
  try {
    let res = await Historique.deleteMany();
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
  deleteAll,
};
