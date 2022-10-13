import express from 'express';
import ModeleCtrl from '../ctrls/modele.ctrl';

const ModeleRouter = express.Router();

ModeleRouter.get('/all', ModeleCtrl.all);
ModeleRouter.get('/', ModeleCtrl.findByTutelle);
ModeleRouter.get('/:id', ModeleCtrl.one);
ModeleRouter.post('/', ModeleCtrl.create);
ModeleRouter.put('/:id', ModeleCtrl.update);
ModeleRouter.delete('/:id', ModeleCtrl.remove);
ModeleRouter.delete('/', ModeleCtrl.deleteAll);
ModeleRouter.get('/statistique', ModeleCtrl.getStatistique);

export default ModeleRouter;
