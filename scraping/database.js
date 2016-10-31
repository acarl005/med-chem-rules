const pg = require('pg')

module.exports = new pg.Client({
  user: 'andy',
  password: 'corn',
  database: 'drug-data',
  host: 'localhost',
  port: 5432 
})
