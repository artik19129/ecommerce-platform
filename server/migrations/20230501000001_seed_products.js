exports.up = function(knex) {
  return knex('products').insert([
    {
      name: 'Smartphone X',
      price: 999.99,
      description: 'Latest model with advanced features',
    },
    {
      name: 'Laptop Pro',
      price: 1299.99,
      description: 'Powerful laptop for professionals',
    },
    {
      name: 'Wireless Earbuds',
      price: 129.99,
      description: 'High-quality sound with noise cancellation',
    },
    {
      name: 'Smart Watch',
      price: 249.99,
      description: 'Track fitness and stay connected',
    },
    {
      name: 'Tablet Mini',
      price: 399.99,
      description: 'Portable and powerful tablet',
    }
  ]);
};

exports.down = function(knex) {
  return knex('products').del();
}; 