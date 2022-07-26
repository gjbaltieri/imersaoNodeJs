const assert = require('assert')
const ContextStrategy = require('../db/strategies/base/contextStrategy')
const MongoDB = require('../db/strategies/mongoDB/mongoDB')
const HeroiSchema = require('../db/strategies/mongoDB/schemas/heroisSchema')

const MOCK_HEROI_CREATE = {
    nome: 'Homem aranha',
    poder: 'Soltar teia'
}

const MOCK_HEROI_DEFAULT = {
    nome: `Patolino - ${Date.now()}`,
    poder: 'Soltar teia',
}

const MOCK_HEROI_UPDATE = {
    nome: `Patolino - ${Date.now()}`,
    poder: 'Velocidade',
}

let MOCK_HEROI_UPDATE_ID

let context = {}

describe('MongoDB methods test', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = new MongoDB().connect()
        context = new ContextStrategy(new MongoDB(connection, HeroiSchema))
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_UPDATE)
        MOCK_HEROI_UPDATE_ID = result._id
    })
    after(async function () {
        await context.close()
    })
    it('context create test', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CREATE)
        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CREATE)
    })
    it('Read', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_DEFAULT)
    })
    it('Update', async () => {
        const result = await context.update(MOCK_HEROI_UPDATE_ID, {
            nome: 'Pernalonga'
        })
        assert.deepStrictEqual(result.modifiedCount, 1)
    })
    it('Delete', async () => {
        const result = await context.delete(MOCK_HEROI_UPDATE_ID)
        assert.deepStrictEqual(result.deletedCount, 1)
    })
})