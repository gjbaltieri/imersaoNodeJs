const dotenvHelper = require('./src/helper/envHelper')
dotenvHelper()
const Hapi = require('@hapi/hapi')
const { mongoDB, Postgres } = require('./src/db/strategies/dbs')
const Context = require('./src/db/strategies/base/contextStrategy')
const HeroiSchema = require('./src/db/strategies/mongoDB/schemas/heroisSchema')
const { heroRoute, UtilRoute, authRoutes } = require('./src/routes/routes')
const HapiSwagger = require('hapi-swagger')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const HapiJWT = require('hapi-auth-jwt2')
const userSchema = require('./src/db/strategies/postgres/schemas/userSchema')

const swaggerOptions = {
    info: {
        title: 'Api de herois - #CursoNodeBR',
        version: 'v1.0'
    }
}
const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = new mongoDB().connect()
    const context = new Context(new mongoDB(connection, HeroiSchema))

    const postgresConnection = await Postgres.connect()
    const model = await Postgres.defineModel(postgresConnection, userSchema)
    const postgres = new Context(new Postgres(connection, model))
    await app.register([
        HapiJWT,
        inert,
        vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.auth.strategy('jwt', 'jwt', { //aqui ele já verifica o token e retorna true ou false
        key: process.env.JWT_SECRET,
        // options: {
        //     expiresIn: 5000
        // }
        validate: async (dado, request) => {
            //verifica no banco se o usuário continua ativo/pagando

            return {
                isValid: true // caso não valido retorna false
            }
        }
    })
    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new heroRoute(context), heroRoute.methods()),
        ...mapRoutes(new authRoutes(process.env.JWT_SECRET, postgres), authRoutes.methods()),
        ...mapRoutes(new UtilRoute(process.env.JWT_SECRET, postgres), UtilRoute.methods())
    ])

    await app.start()
    console.log('rodando')
    return app
}

module.exports = main()