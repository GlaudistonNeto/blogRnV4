const config = require('../knexfile.js');
const knex = require('Knex')(config)

knex.migrate.latest([config])
module.exports = knex
