exports.up = async function (knex) {
  // Needed for uuid.
  await knex.raw(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  );

  return knex.schema
    .createTable('user', function (table) {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('username').notNullable();
      table.string('name');
      table.uuid('item_id');
      table
        .timestamp('created_at')
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.fn.now());
    })
    .createTable('item', function (table) {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table
        .boolean('is_private')
        .notNullable()
        .defaultTo(false);
      table
        .timestamp('created_at')
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.fn.now());
    })
    .createTable('item_item', function (table) {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('parent_item_id')
        .notNullable()
        .references('id')
        .inTable('item')
        .onDelete('CASCADE');
      table
        .uuid('child_item_id')
        .notNullable()
        .references('id')
        .inTable('item')
        .onDelete('CASCADE');
      table
        .timestamp('created_at')
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('item_item')
    .dropTable('user')
    .dropTable('item');
};
