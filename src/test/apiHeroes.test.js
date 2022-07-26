const assert = require('assert')
const api = require('../../api')

const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6InRlc3RlMTIzIiwiaWF0IjoxNjU4NDM2NTY1fQ.D0jNhbi-zWMfCK8Ovs5zegoDb9__s3YRDz4UuKZnfa0'
const headers = {
    authorization: Token
}
const MOCK_CREATE_TEST = {
    nome: `Chapolin`,
    poder: `Marreta Bionica - ${Date.now()}`
}
const MOCK_HEROIS_UPDATE_INICIAL = {
    nome: `Batman do futuro - ${Date.now()}`,
    poder: 'Ser rico no futuro'
}
const VALID_ID = '62d85a78d5fc71573a93b8f3'

let MOCK_ID = ''

let app = {}
describe('Api Routes tests', async function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            headers,
            method: 'POST',
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROIS_UPDATE_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })
    it('Listar todos os herois em /herois', async function () {
        const result = await app.inject({
            headers,
            method: 'GET',
            url: '/herois'
        })
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(result.result))
    })
    it('/herois deve retornar um item', async function () {
        const nome = MOCK_HEROIS_UPDATE_INICIAL.nome
        const result = await app.inject({
            headers,
            method: 'GET',
            url: `/herois?nome=${nome}&limit=2&skip=0`
        })
        const data = result.result
        assert.deepEqual(data.length, 1)
    })
    it('Listar um total de 3 herois', async function () {
        const limit = 3
        const result = await app.inject({
            headers,
            method: 'GET',
            url: `/herois?&limit=${limit}&skip=0`
        })
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(result.result))
    })
    it('Retornar erro ao passar uma String no Limit', async function () {
        const limit = 'AAA'
        const result = await app.inject({
            headers,
            method: 'GET',
            url: `/herois?nome=&limit=${limit}&skip=0`
        })
        const resultError = {
            statusCode: 400,
            error: "Bad Request",
            message: '"limit" must be a number',
        }
        const dados = JSON.parse(result.payload)
        assert.deepStrictEqual(dados.error, resultError.error)
        assert.deepStrictEqual(dados.message, resultError.message)
        assert.deepStrictEqual(dados.statusCode, 400)
    })
    it('Cadastrar - POST /herois', async function () {
        const result = await app.inject({
            headers,
            method: 'POST',
            url: `/herois`,
            payload: MOCK_CREATE_TEST
        })
        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(message, 'Herói cadastrado com sucesso!')
        assert.notDeepStrictEqual(_id, undefined)
    })
    it('Update - PATCH - /herois/:id', async () => {
        const _id = MOCK_ID
        const dadoAtualizar = {
            nome: 'Batman do passado'
        }
        const result = await app.inject({
            headers,
            url: `/herois/${_id}`,
            method: 'PATCH',
            payload: JSON.stringify(dadoAtualizar)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(dados.message, 'Heroi atualizado com sucesso!')
    })
    it('Update - PATCH - /herois/:id não deve atualizar com ID inexistente', async () => {
        const dadoAtualizar = {
            nome: 'Batman do passado'
        }
        const result = await app.inject({
            headers,
            url: `/herois/${VALID_ID}`,
            method: 'PATCH',
            payload: JSON.stringify(dadoAtualizar)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepStrictEqual(statusCode, 412)
        assert.deepStrictEqual(dados.message, 'Não foi possível atualizar o heroi!')
    })
    it('Remover DELETE - /herois/:id', async () => {
        const result = await app.inject({
            headers,
            url: `/herois/${MOCK_ID}`,
            method: 'DELETE'
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi removido com sucesso!')
    })
    it('Remover DELETE - /herois/:id não deve remover ID inexistente', async () => {
        const result = await app.inject({
            headers,
            url: `/herois/${VALID_ID}`,
            method: 'DELETE'
        })
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Não foi possivel remover o heroi!'
          }
        assert.deepStrictEqual(dados, expected)
    })
    it('Remover DELETE - /herois/:id não deve remover ID inexistente', async () => {
        const _id = 'ID_INVALIDO'
        const result = await app.inject({
            headers,
            url: `/herois/${_id}`,
            method: 'DELETE'
        })
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
          }
        assert.deepStrictEqual(dados, expected)
    })
})
