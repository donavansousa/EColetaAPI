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

        const serializedPoints=points.map(point=>{
            return{
                ...point,
                image_url: `http://10.0.0.217:3333/uploads/${point.image}`
            }
        });
        return response.json(serializedPoints);
    }

    async show(request: Request,response: Response){
        const{id}=request.params;
        const point=await Knex('points').where('id',id).first();
        
       
        
        if(!point){
            return response.status(404).json({messsage:"Point not found"});
        }

        const serializedPoint={
            ...point,
            image_url: `http://10.0.0.217:3333/uploads/${point.image}`   
        }


        const items=await Knex('items')
        .join('points_items','items.id','=','points_items.item_id')
        .where('points_items.point_id',id)
        .select('items.title');

        return response.json({point: serializedPoint,items});
    }

    async create (request: Request,response: Response){
    
        const {
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
            image:request.file.filename,
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
    
        const pointItems=items.
        split(',')
        .map((item:string)=> Number(item.trim()) )
        .map((item_id:Number)=>
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