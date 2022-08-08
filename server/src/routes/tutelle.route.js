import express from 'express';
import tutelleCtrl from '../ctrls/tutelle.ctrl';

const tutelleRouter = express.Router();

tutelleRouter.get('/', tutelleCtrl.all);
tutelleRouter.get('/:id', tutelleCtrl.one);
tutelleRouter.post('/', tutelleCtrl.create);
tutelleRouter.put('/:id', tutelleCtrl.update);
tutelleRouter.delete('/:id', tutelleCtrl.remove);
tutelleRouter.delete('/', tutelleCtrl.deleteAll);

export default tutelleRouter;