import express from 'express';
import historiqueCtrl from '../ctrls/historique.ctrl';

const historiqueRouter = express.Router();

historiqueRouter.get('/', historiqueCtrl.all);
historiqueRouter.get('/:id', historiqueCtrl.one);
historiqueRouter.post('/', historiqueCtrl.create);
//historiqueRouter.put('/:id', historiqueCtrl.update);
historiqueRouter.delete('/', historiqueCtrl.deleteAll);

export default historiqueRouter;