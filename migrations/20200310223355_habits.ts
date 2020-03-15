import * as Knex from 'knex';

export async function up(db: Knex): Promise<any> {
  await db.schema.createTable('habits', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v4()'))
      .primary();

    table.text('content');

    table.specificType('tags', 'TEXT ARRAY');

    table
      .uuid('created_by', 50)
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE').onUpdate;

    table
      .uuid('updated_by', 50)
      .notNullable()
      .references('id')
      .inTable('users');

    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await db.schema.dropTableIfExists('habits');
}

export const configuration = { transaction: true };
