import express from 'express';
import userCtrl from '../ctrls/user.ctrl';

const userRouter = express.Router();

userRouter.get('/all', userCtrl.all);
userRouter.get('/', userCtrl.findByTutelle);
userRouter.get('/:id', userCtrl.one);
userRouter.post('/', userCtrl.create);
userRouter.post('/login', userCtrl.login);
userRouter.put('/:id', userCtrl.update);
userRouter.delete('/', userCtrl.deleteAll);
userRouter.delete('/:id', userCtrl.remove);

export default userRouter;