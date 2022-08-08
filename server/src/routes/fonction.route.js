import express from 'express';
import fonctionCtrl from '../ctrls/fonction.ctrl';

const fonctionRouter = express.Router();

fonctionRouter.get('/all', fonctionCtrl.all);
fonctionRouter.get('/:id', fonctionCtrl.one);
fonctionRouter.post('/', fonctionCtrl.create);
fonctionRouter.put('/:id', fonctionCtrl.update);
fonctionRouter.delete('/:id', fonctionCtrl.remove);
fonctionRouter.delete('/', fonctionCtrl.deleteAll);
fonctionRouter.get('/', fonctionCtrl.findByTutelle);

export default fonctionRouter;