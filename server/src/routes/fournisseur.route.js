import express from 'express';
import FournisseurCtrl from '../ctrls/fournisseur.ctrl';

const FournisseurRouter = express.Router();

FournisseurRouter.get('/all', FournisseurCtrl.all);
FournisseurRouter.get('/', FournisseurCtrl.findByTutelle);
FournisseurRouter.get('/:id', FournisseurCtrl.one);
FournisseurRouter.post('/', FournisseurCtrl.create);
FournisseurRouter.put('/:id', FournisseurCtrl.update);
FournisseurRouter.delete('/:id', FournisseurCtrl.remove);
FournisseurRouter.delete('/', FournisseurCtrl.deleteAll);
FournisseurRouter.get('/statistique', FournisseurCtrl.getStatistique);

export default FournisseurRouter;
