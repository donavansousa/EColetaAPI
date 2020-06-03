import Knex from '../database/connection'
import {Request, Response, json} from 'express'

class PointControllers {

    async index(request: Request, response:Response){
        const{ city, uf, items}=request.query;

        const parserdItems=String(items).split(',').map(item=>item.trim());

        const points=await Knex('points')
        .join('points_items','points.id','=','points_items.point_id')
        .whereIn('item_id',parserdItems)
        .where('points.city',String(city))
        .where('points.uf',String(uf))
        .distinct()
        .select('points.*');
        return response.json(points);
    }

    async show(request: Request,response: Response){
        const{id}=request.params;
        const point=await Knex('points').where('id',id).first();
        
        if(!point){
            return response.status(404).json({messsage:"Point not found"});
        }


        const items=await Knex('items')
        .join('points_items','items.id','=','points_items.item_id')
        .where('points_items.point_id',id)
        .select('items.title');

        return response.json({point,items});
    }

    async create (request: Request,response: Response){
    
        const {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
    
        }=request.body;
    
        const trx=await Knex.transaction();
        const point={
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        const insertedIds=await trx('points').insert(point);
    
        const point_id=insertedIds[0];
    
        const pointItems=items.map((item_id:Number)=>
         {
            return {
                item_id,
                point_id
            };
         });
    
         //console.log(pointItems);
        await trx('points_items').insert(pointItems);
        await trx.commit();
        
        return response.json({id:point_id,...point});
    }
}

export default PointControllers;