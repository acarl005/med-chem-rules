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
  yield send(this, './server/index.html')
})

app.use(router.routes())

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening at http://localhost:${port}`))
