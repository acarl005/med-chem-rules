const koa = require('koa')
const koaRouter = require('koa-router')
const send = require('koa-send')
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

const app = koa()
const router = koaRouter()

router.get('/', function* () {
  yield send(this, './serve/client/index.html')
})

router.get('/main.js', function* () {
  yield send(this, './serve/client/main.js')
})

router.get('/style.css', function* () {
  yield send(this, './serve/client/style.css')
})

router.get('/h_bond_acceptors', function* () {
  const sql = `
    SELECT
      h_bond_acceptor_count,
      COUNT(*) AS total
    FROM drugs WHERE h_bond_acceptor_count IS NOT NULL
    GROUP BY h_bond_acceptor_count
    ORDER BY h_bond_acceptor_count
  `
  const data = yield knex.raw(sql)
  this.set({ 'Content-Type': 'application/json' })
  this.body = JSON.stringify(data.rows)
})

router.get('/molecular_weights', function* () {
  const sql = `
    WITH intervals AS (
      SELECT (molecular_weight / 10.0)::INT * 10 AS weight_interval
      FROM drugs WHERE molecular_weight IS NOT NULL AND molecular_weight < 1000
    )
    SELECT
      weight_interval,
      count(*) AS total
    FROM intervals
    GROUP BY weight_interval
    ORDER BY weight_interval;
  `
  const data = yield knex.raw(sql)
  this.set({ 'Content-Type': 'application/json' })
  this.body = JSON.stringify(data.rows)
})

app.use(router.routes())

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening at http://localhost:${port}`))

