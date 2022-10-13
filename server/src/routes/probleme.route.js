import express from 'express';
import problemeCtrl from '../ctrls/probleme.ctrl';
import Probleme from '../models/probleme.model';

function problemRouter(wss) {
  const varProblemeRouter = express.Router();

  varProblemeRouter.get('/', problemeCtrl.all);
  varProblemeRouter.get('/something', problemeCtrl.findByTutelle);
  varProblemeRouter.get('/:id', problemeCtrl.one);
  varProblemeRouter.post('/', problemeCtrl.create);
  varProblemeRouter.put('/:id/some', problemeCtrl.update);
  varProblemeRouter.put('/:id', problemeCtrl.updateSomething);
  varProblemeRouter.delete('/', problemeCtrl.deleteAll);

  varProblemeRouter.ws('/admin', (ws) => {
    ws.on('message', async (msg) => {
      /*  console.log(msg); */
      const body = JSON.parse(msg);
      await Probleme.updateOne({ _id: body._id }, { ...body });
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            from: 'admin',
          })
        );
      });
    });
  });

  varProblemeRouter.ws('/chefDivision', (ws) => {
    ws.on('message', async (msg) => {
      /*  console.log(msg); */
      const body = JSON.parse(msg);
      await Probleme.updateOne({ _id: body._id }, { ...body });
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            from: 'chefDivision',
          })
        );
      });
    });
  });

  varProblemeRouter.ws('/utilisateur', (ws) => {
    ws.on('message', async (msg) => {
      /*  console.log(msg); */
      const body = JSON.parse(msg);
      await Probleme.updateOne({ _id: body._id }, { ...body });
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            from: 'utilisateur',
          })
        );
      });
    });
  });

  return varProblemeRouter;
}
//problemeRouter.put('/:id', problemeCtrl.update);
//problemeRouter.delete('/:id', problemeCtrl.remove);

export default problemRouter;
