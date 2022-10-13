import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import expressWs from 'express-ws';

import directionRouter from './routes/direction.route';
import tutelleRouter from './routes/tutelle.route';
import fonctionRouter from './routes/fonction.route';
import categorieRouter from './routes/categorie.route';
import materielRouter from './routes/materiel.route';
import historiqueCtrl from './routes/historique.route';
import userRouter from './routes/user.route';
import problemRouter from './routes/probleme.route';
import modeleRouter from './routes/modele.route';
import fournisseurRouter from './routes/fournisseur.route';
import { _DB_URL } from '../../src/services/environment';

require('dotenv').config();

const app = express();
const wss = expressWs(app).getWss();
app.use(express.json());
app.use(cors());

// Connection a la base de donnees mongo
mongoose.connect(_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use('/tutelles', tutelleRouter);
app.use('/directions', directionRouter);
app.use('/fournisseurs', fournisseurRouter);
app.use('/modeles', modeleRouter);
app.use('/fonctions', fonctionRouter);
app.use('/categories', categorieRouter);
app.use('/materiels', materielRouter);
app.use('/historiques', historiqueCtrl);
app.use('/users', userRouter);
app.use('/probleme', problemRouter(wss));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Server is running...'));
