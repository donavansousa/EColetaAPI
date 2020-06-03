import Knex from 'knex';
export async function up(kenex: Knex){
   return kenex.schema.createTable('points_items',table=>{
        table.increments('id').primary();

        table.integer('point_id').notNullable().references('id').inTable('points');

        table.integer('item_id').notNullable().references('id').inTable('items');

    });
}

export async function down(kenex: Knex){
    return kenex.schema.dropTable('points_items');
}