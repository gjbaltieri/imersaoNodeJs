require('dotenv').config()
const Mongoose = require('mongoose')
const STATUS = require('../status/mongoose-Status')

const connection = Mongoose.connection

async function connect() {
  Mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true }, err => {
    if (!err) return
    console.log('Falha na conexão!', err)
  })
  connection.once('open', () => console.log('database rodando!'))
  return connection
}

async function close() {
  return await connection.close()
}

async function state() {
  Mongoose.connection.once('open', () => {
    return console.log(Mongoose.connection.readyState)
  })
}
module.exports = { connect, close, state }