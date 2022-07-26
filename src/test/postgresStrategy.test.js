const assert = require('assert')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const HeroiSchema = require('../db/strategies/postgres/schemas/heroiSchema')

const MOCK_HEROI_CREATE = {
    nome: 'Homem Aranha',
    poder: 'Soltar teia'
}
const MOCK_HEROI_UPDATE = {
    nome: 'Vegeta',
    poder: 'Super Sayajin',
}

let context = {}

describe('Postgress Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_UPDATE)
    })
    it('PostgresSQL Connection', async () => {
        const result = await context.isConnect()
        assert.strictEqual(result, true)
    })
    it('Create', async () => {
        const result = await context.create(MOCK_HEROI_CREATE)
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CREATE)
    })
    it('Read', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CREATE.nome })
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CREATE)
    })
    it('Update', async () => {
        const [atualizar] = await context.read({nome: MOCK_HEROI_UPDATE.nome})
        const itemUpdate = {
            ...atualizar,
            nome: 'Goku',
            poder: 'Kamehameha'
        }
        const result = await context.update(itemUpdate, {id: atualizar.id})
        const [att] = await context.read({id: atualizar.id})
        assert.deepStrictEqual(itemUpdate, att)
        assert.deepStrictEqual(result, [1])
    })
    it('Remover', async ()=> {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepStrictEqual(result, 1)
    })
})