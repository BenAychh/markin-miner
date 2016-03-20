exports.up = function(knex, Promise) {
  return knex.schema.createTable('realtimeprices', function(table) {
    table.increments();
    table.integer('stock_id');
    table.float('price');
    table.date('captured_time');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('realtimeprices');
};
