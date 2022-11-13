import express from 'express';
import pieceCtrl from '../ctrls/piece.ctrl';

const pieceRouter = express.Router();

pieceRouter.get('/all', pieceCtrl.all);
pieceRouter.get('/', pieceCtrl.findByTutelle);
pieceRouter.get('/:id', pieceCtrl.one);
pieceRouter.post('/', pieceCtrl.create);
pieceRouter.put('/:id', pieceCtrl.update);
pieceRouter.delete('/:id', pieceCtrl.remove);
pieceRouter.delete('/', pieceCtrl.deleteAll);

export default pieceRouter;
