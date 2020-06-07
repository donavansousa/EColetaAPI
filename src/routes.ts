import express from 'express';
import Knex from './database/connection';
import PointControllers from './controllers/PointControllers';
import ItemsControllers from './controllers/ItemsControllers';
import multer from 'multer';
import multerConfig from './config/multer'
import {celebrate, Joi} from 'celebrate';

const routes=express.Router();
const upload=multer(multerConfig);
const pointControllers=new PointControllers();
const itemsControllers=new ItemsControllers();


routes.get('/items',itemsControllers.index);

routes.post('/points',
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required().email(),
        whatsapp:Joi.number().required(),
        latitude:Joi.number().required(),
        longitude:Joi.number().required(),
        city:Joi.string().required(),
        uf:Joi.string().required().max(2),
        items:Joi.string().required()
    })
},{abortEarly:false}),
pointControllers.create);
routes.get('/points',pointControllers.index);
routes.get('/points/:id',pointControllers.show);

export default routes;
