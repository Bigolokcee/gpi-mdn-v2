import express from 'express';
import categorieCtrl from '../ctrls/categorie.ctrl';

const categorieRouter = express.Router();

categorieRouter.get('/all', categorieCtrl.all);
categorieRouter.get('/', categorieCtrl.findByTutelle);
categorieRouter.get('/:id', categorieCtrl.one);
categorieRouter.post('/', categorieCtrl.create);
categorieRouter.put('/:id', categorieCtrl.update);
categorieRouter.delete('/:id', categorieCtrl.remove);
categorieRouter.delete('/', categorieCtrl.deleteAll);
categorieRouter.get('/statistique', categorieCtrl.getStatistique);

export default categorieRouter;
