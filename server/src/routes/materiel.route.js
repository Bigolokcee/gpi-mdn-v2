import express from 'express';
import materielCtrl from '../ctrls/materiel.ctrl';

const materielRouter = express.Router();

materielRouter.get('/all', materielCtrl.all);
materielRouter.get('/', materielCtrl.findByTutelle);
materielRouter.get('/:id', materielCtrl.one);
materielRouter.post('/', materielCtrl.create);
materielRouter.put('/:id', materielCtrl.update);
materielRouter.delete('/:id', materielCtrl.remove);
materielRouter.delete('/', materielCtrl.deleteAll);

export default materielRouter;
