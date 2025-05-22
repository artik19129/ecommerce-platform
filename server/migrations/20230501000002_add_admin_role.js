exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.boolean('is_admin').notNullable().defaultTo(false);
  })
  .then(function() {
    return knex('users').insert({
      username: 'admin',
      is_admin: true
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('is_admin');
  });
}; 