exports.up = async function (knex) {
  // Needed for uuid.
  await knex.raw(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  );

  return knex.schema
    .createTable('item', function (table) {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('slug').notNullable();
      table.uuid('user_id').notNullable();
      table.specificType('item_ids', 'text ARRAY');
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
    .createTable('user', function (table) {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.uuid('item_id');
      table
        .timestamp('created_at')
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('item').dropTable('user');
};
