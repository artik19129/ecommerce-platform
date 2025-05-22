exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .createTable('products', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.text('description');
      table.string('image_url');
      table.timestamps(true, true);
    })
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.decimal('total', 10, 2).notNullable();
      table.timestamps(true, true);
      table.foreign('user_id').references('users.id');
    })
    .createTable('order_items', function(table) {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('quantity').notNullable().defaultTo(1);
      table.decimal('price', 10, 2).notNullable();
      table.timestamps(true, true);
      table.foreign('order_id').references('orders.id');
      table.foreign('product_id').references('products.id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('order_items')
    .dropTable('orders')
    .dropTable('products')
    .dropTable('users');
}; 