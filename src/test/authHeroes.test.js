const assert = require('assert')
const api = require('../../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres');
const userSchema = require('../db/strategies/postgres/schemas/userSchema')
let app = {}

const MOCK_USER = {
    userName: 'teste123',
    password: '123456'
}
let MOCK_USER_DB = {
    username: MOCK_USER.userName.toLowerCase(),
    password: '$2b$04$55AScZg49Lj/mPk9IWo/jORk1p8YKPEixwstfP0qybtirf/QVUjUe'
}

describe('Auth suite tests', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api
        const postgresConnection = await Postgres.connect()
        const model = await Postgres.defineModel(postgresConnection, userSchema)
        const postgres = new Context(new Postgres(postgresConnection, model))
        await postgres.update(MOCK_USER_DB, null, true)
    })
    it('Criar e receber o Token através do POST - /login', async () => {
        const result = await app.inject({
            url: '/login',
            method: 'POST',
            payload: {
                username: MOCK_USER.userName,
                password: MOCK_USER.password
            }
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        assert.ok(dados.token.length > 20)
        assert.notDeepStrictEqual(dados.token, undefined)
    })
    it('Deve retornar não autorizado ao tentar um login com dados errados',async () => {
        const result = await app.inject({
            url: '/login',
            method: 'POST',
            payload: {
                username: 'login incorreto',
                password: 'senha incorreta'
            }
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(dados.error, 'Unauthorized')
    })
})