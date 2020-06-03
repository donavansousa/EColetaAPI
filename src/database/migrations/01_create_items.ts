import Knex from 'knex';
export async function up(kenex: Knex){
   return kenex.schema.createTable('items',table=>{
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(kenex: Knex){
    return kenex.schema.dropTable('items');
}