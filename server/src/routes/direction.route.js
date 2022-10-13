import express from 'express';
import directionCtrl from '../ctrls/direction.ctrl';

const directionRouter = express.Router();

directionRouter.get('/', directionCtrl.findByTutelle);
directionRouter.get('/all', directionCtrl.all);
directionRouter.get('/:id', directionCtrl.one);
directionRouter.post('/', directionCtrl.create);
directionRouter.put('/:id', directionCtrl.update);
directionRouter.delete('/:id', directionCtrl.remove);
directionRouter.delete('/', directionCtrl.deleteAll);
export default directionRouter;
