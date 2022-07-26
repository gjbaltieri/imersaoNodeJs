const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongoDB')
const Postgres = require('./db/strategies/postgres')

const mongodb = new ContextStrategy(new MongoDB)

mongodb.isConnect()

const postgres = new ContextStrategy(new Postgres)

postgres.connect()