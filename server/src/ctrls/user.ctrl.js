import User from '../models/user.model';
import bcrypt from 'bcrypt';

async function all(req, res) {
  try {
    const data = await User.find({ enabled: true, ...req.query })
      .populate('bureau')
      .populate('direction')
      .populate('tutelle');

    return res.status(200).json({
      status: 200,
      message: 'Liste de tous les utilisateurs',
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function findByTutelle(req, res) {
  try {
    const data = await User.find({ enabled: true, ...req.query })
      .populate('bureau')
      .populate('direction')
      .populate('tutelle');

    return res.status(200).json({
      status: 200,
      message: 'Liste des utilisateurs dans une tutelle',
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function one(req, res) {
  try {
    const id = req.params.id;
    const data = await User.findOne({ _id: id });
    return res.status(200).json({
      status: 200,
      message: 'ok',
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function create(req, res) {
  try {
    const body = req.body;
    const { username } = body;

    if (username.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid data!',
        data: null,
      });
    } else {
      body.password = await bcrypt.hash(body.password, 2);
      const newUser = new User(body);
      const data = await newUser.save();

      return res.status(201).json({
        status: 201,
        message: 'User created successfully!',
        data,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });

    // console.log(e)
  }
}

async function update(req, res) {
  try {
    const body = req.body;
    // console.log(body)
    const { nom } = body;
    if (nom.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid data!',
        data: null,
      });
    } else {
      const id = req.params.id;
      if (body.password != '') {
        body.password = await bcrypt.hash(body.password, 2);
        const data = await User.updateOne({ _id: id }, body);
        return res.status(201).json({
          status: 201,
          message: 'User updated successfully!',
          data,
        });
      } else {
        const data = await User.updateOne({ _id: id }, body);
        return res.status(201).json({
          status: 201,
          message: 'User updated successfully!',
          data,
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
    // console.log(e)
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    await User.updateOne(
      { _id: id },
      {
        enabled: false,
      }
    );
    return res.status(201).json({
      status: 201,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  var foundedUser = null;
  if (username.indexOf('@') != -1) {
    foundedUser = await User.findOne({ email: username, enabled: true });
  } else {
    foundedUser = await User.findOne({ username, enabled: true });
  }
  if (!foundedUser) {
    return res.status(404).json({
      status: 404,
      message: 'Invalid credentials',
      data: null,
    });
  }
  const pwdStatus = await bcrypt.compare(password, foundedUser.password);
  if (!pwdStatus) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid credentials',
      data: null,
    });
  }
  delete foundedUser.password;
  return res.status(200).json({
    status: 200,
    message: 'User logged',
    data: foundedUser,
  });
}

async function deleteAll() {
  //
  try {
    let res = await User.deleteMany();
    return res.status(200).json({
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
  login,
  deleteAll,
  findByTutelle,
};
