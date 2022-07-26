const Hapi = require('hapi')
const app = new Hapi.Server({
    port: 5000
})
const MongoDB = require('./db/strategies/mongoDB/mongoDB')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongoDB/schemas/heroisSchema')

const connection = new MongoDB().connect()
const context = new Context(new MongoDB(connection, HeroiSchema))
async function main() {
    app.route([{
        path: '/',
        method: 'GET',
        handler: (req, head) => {
            return 'Hello Node!'
        }
    },
    {
        path: '/herois',
        method: 'GET',
        handler: (req, head) => {
            return context.read()
        }
    }
])
    await app.start()
    console.log('rodando')
}

main()