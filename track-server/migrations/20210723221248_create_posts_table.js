
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
    table.increments('id').primary()
    table.string('description', 1000)
    table.binary('content').notNull()
    table.integer('parentId').references('id')
      .inTable('posts')
    table.integer('userId').references('id')
      .inTable('users').notNull()
      table.string('lat').notNull()
      table.string('long').notNull()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};

//add LATITUDE n' LONGITUDE to the posts
