import Problem from '../models/probleme.model';

async function all(req, res) {
  try {
    /* Show data by Tutelle and Direction */
    const executeBy = req.query.executeBy;
    const assignedTo = req.query.assignedTo;
    let solutionPreconise = req.query.solutionPreconise;
    const tutelle = req.query.tutelle;
    const isProgress = req.query.isProgress;

    // console.log(assignedTo);
    // console.log("solutionPreconise",solutionPreconise);


    // assignedTo == undefined ? null : req.query.assignedTo;
    // executeBy == undefined ? null : req.query.executeBy;


    let data = null;

    // console.log(executeBy + " || " + assignedTo + " || " + solutionPreconise)

    //data = await Problem.find({ enabled: true, assignedTo, executeBy }).populate('sender').populate('assignedTo').populate('executeBy').populate('materiel').sort({createdAt: -1})
    // data = await Problem.find({
    //   enabled: true,
    //   assignedTo,
    //   executeBy,
    //   tutelle,
    // })
    data = await Problem.find({
      enabled: true
    })
      .populate({
        path: 'sender',
        populate: { path: 'direction' },
      })
      .populate('assignedTo')
      .populate('executeBy')
      .populate('tutelle')
      .populate('materiel')
      .sort({ createdAt: -1 });

    // console.log(data);
    if (assignedTo == undefined && executeBy != undefined) {
      //Pour avoir les taches éffectué par le technicien
      data = await Problem.find({ enabled: true, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (executeBy != undefined && solutionPreconise == undefined) {
      solutionPreconise = null;
      data = await Problem.find({ enabled: true, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (executeBy != undefined && solutionPreconise != undefined) {
      data = await Problem.find({
        enabled: true,
        tutelle,
        statut: { $ne: true },
      })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (assignedTo != undefined) {
      console.log(assignedTo)
      data = await Problem.find({ enabled: true, assignedTo, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');

      // console.log(data)
    }
    if (
      solutionPreconise == undefined &&
      executeBy != undefined &&
      assignedTo == undefined
    ) {
      data = await Problem.find({ enabled: true, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (solutionPreconise == 'true' && executeBy != null) {
      //Pour avoir les taches suivies par le Chef de division
      solutionPreconise != null;
      data = await Problem.find({ enabled: true, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (isProgress != undefined) {
      console.log(isProgress);
      //Pour avoir les taches suivies par le Chef de division
      data = await Problem.find({ enabled: true, tutelle, isProgress })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }

    return res.status(200).json({
      status: 200,
      message: 'La liste des problemes  ',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: error,
    });

    // console.log(error)
  }
}

async function findByTutelle(req, res) {
  try {
    /* Show data by Tutelle and Direction */
    const executeBy = req.query.executeBy;
    const assignedTo = req.query.assignedTo;
    let solutionPreconise = req.query.solutionPreconise;
    const tutelle = req.query.tutelle;

    assignedTo == undefined ? null : req.query.assignedTo;
    executeBy == undefined ? null : req.query.executeBy;

    console.log('Facon', req.query, assignedTo, executeBy);
    let data = null;
    /* 
       /* Recevoir les taches recu par l'Administrateur */

    try {
      data = await Problem.find({
        enabled: true,
        assignedTo,
        executeBy,
        tutelle,
      })
        .populate({
          path: 'sender',
          populate: { path: 'direction' },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('tutelle')
        .populate('materiel')
        .sort({ createdAt: -1 });
    } catch (error) {
      //    console.log("125",error)
    }

    if (assignedTo == undefined && executeBy != undefined) {
      //Pour avoir les taches éffectué par le technicien
      data = await Problem.find({ enabled: true, executeBy, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
      console.log('137');
    }

    if (assignedTo != undefined && executeBy == undefined) {
      console.log('143');
      try {
        data = await Problem.find({
          enabled: true,
          executeBy,
          assignedTo,
          tutelle,
        })
          .populate({
            path: 'sender',
            populate: {
              path: 'direction',
            },
          })
          .populate('assignedTo')
          .populate('executeBy')
          .populate('materiel');
      } catch (error) {
        console.log(error);
      }
    }

    if (executeBy != undefined && solutionPreconise == undefined) {
      console.log('158');
      solutionPreconise = null;
      data = await Problem.find({
        enabled: true,
        executeBy,
        solutionPreconise,
        tutelle,
      })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
      console.log('152');
    }
    if (executeBy != undefined && solutionPreconise != undefined) {
      console.log('169');
      data = await Problem.find({
        enabled: true,
        executeBy,
        solutionPreconise,
        tutelle,
        statut: { $ne: true },
      })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
      console.log('162');
    }
    if (solutionPreconise == 'true' && assignedTo != undefined) {
      console.log('178');
      //Les tâches venant de l'Administrateur vers le Chef de division
      data = await Problem.find({ enabled: true, assignedTo, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (
      solutionPreconise == undefined &&
      executeBy != undefined &&
      assignedTo == undefined
    ) {
      console.log('189');
      data = await Problem.find({ enabled: true, tutelle, assignedTo })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }
    if (solutionPreconise == 'true' && executeBy != null) {
      console.log('199');
      //Pour avoir les taches suivies par le Chef de division (Les taches assigné à un technicien)
      /*  solutionPreconise != null */
      data = await Problem.find({ enabled: true, executeBy, tutelle })
        .populate({
          path: 'sender',
          populate: {
            path: 'direction',
          },
        })
        .populate('assignedTo')
        .populate('executeBy')
        .populate('materiel');
    }

    return res.status(200).json({
      status: 200,
      message: 'La liste des problemes  ',
      data,
    });
    // console.log(data)
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: error,
    });
  }
}
async function updateSomething(req, res) {
  try {
    const body = req.body;

    const { isProgress } = body;
    console.log('La vie de', isProgress);

    const id = req.params.id;
    try {
      const data = await Problem.updateOne({ _id: id }, body);
      return res.status(201).json({
        status: 201,
        message: 'Problem updated successfully!',
        data,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function update(req, res) {
  try {
    const body = req.body;

    const { isProgress } = body;
    console.log(isProgress);

    const id = req.params.id;
    try {
      const data = await Problem.updateOne({ _id: id }, body);
      return res.status(201).json({
        status: 201,
        message: 'Problem updated successfully!',
        data,
      });
      // console.log(data)
    } catch (error) {
      // console.log(error)
    }

    /*  if (isProgress != null) {
            const id = req.params.id;
            try {
                const data = await Problem.updateOne({ _id: id }, body);
                return res.status(201).json({
                    status: 201,
                    message: 'Problem updated successfully!',
                    data
                });
               // console.log(data)
            } catch (error) {
               // console.log(error)
            }

        } else {
            console.log("247", isProgress)
            if (statut === undefined) {
                if (solutionPreconise.length === 0) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Invalid data!',
                        data: null
                    });
                } else {
                    const id = req.params.id;
                   // console.log(solutionPreconise)
                    const data = await Problem.updateOne({ _id: id }, body);
                    return res.status(201).json({
                        status: 201,
                        message: 'Problem updated successfully!',
                        data
                    });
                }
            }
            else {
                const id = req.params.id;
                const data = await Problem.updateOne({ _id: id }, body);
                return res.status(201).json({
                    status: 201,
                    message: 'Statut updated successfully!',
                    data
                });
            }
        } */
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: e,
    });
  }
}

async function one(req, res) {
  const { id } = req.params;
  try {
    const data = await Problem.findOne({ _id: id }, { enabled: true })
      .populate({
        path: 'sender',
        populate: {
          path: 'direction',
        },
      })
      .populate('assignedTo')
      .populate('executeBy')
      .populate('materiel');
    return res.status(200).json({
      status: 200,
      message: 'Data successfully send',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
}

async function create(req, res) {
  try {
    const body = req.body;

    if (body.description === '') {
      return res.status(400).json({
        status: 400,
        message: 'Invalid data',
        data: null,
      });
    } else {
      const newProblem = new Problem(body);
      const data = await newProblem.save();
      return res.status(201).json({
        status: 201,
        message: 'Data successfully send',
        data,
      });
    }
  } catch (e) {
    //  console.log(e)
  }
}

async function deleteAll() {
  //
  try {
    await Problem.deleteMany();
  } catch (err) {
    //console.log(err);
  }
}

export default {
  all,
  one,
  create,
  update,
  deleteAll,
  findByTutelle,
  updateSomething,
};
