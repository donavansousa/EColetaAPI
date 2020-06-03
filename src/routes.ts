import express from 'express';
import Knex from './database/connection';
import PointControllers from './controllers/PointControllers';
import ItemsControllers from './controllers/ItemsControllers';

const routes=express.Router();
const pointControllers=new PointControllers();
const itemsControllers=new ItemsControllers();


routes.get('/items',itemsControllers.index);

routes.post('/points',pointControllers.create);
routes.get('/points',pointControllers.index);
routes.get('/points/:id',pointControllers.show);

export default routes;
