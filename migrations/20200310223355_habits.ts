import * as Knex from 'knex';

export async function up(db: Knex): Promise<any> {
  await db.schema.createTable('habits', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v4()'))
      .primary();

    table
      .uuid('user_id', 50)
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE').onUpdate;

    table.text('content');

    table
      .jsonb('tags')
      .notNullable()
      .defaultTo('{}');

    table
      .uuid('parent_id', 50)
      .notNullable()
      .references('id')
      .inTable('habits')
      .onDelete('CASCADE').onUpdate;

    table
      .uuid('created_by', 50)
      .notNullable()
      .references('id')
      .inTable('users');

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
