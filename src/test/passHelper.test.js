const assert = require('assert')
const passwordHelper = require('../helper/passwordHelper')

const MOCK_PASSWORD = 'minhasenhasupersecreta'
const MOCK_HASH = '$2b$04$E5VVWZw5suPAlejlO1YL9OUjjwUpNi91.aA2MffEPSMpoT2qGgUR6'

describe('Suite de testes para senha', function () {
    it('Deve retornar o hash da senha', () => {
        const hash = passwordHelper.hashCreate(MOCK_PASSWORD)
        assert.ok(hash.length > 15)
        assert.notDeepStrictEqual(hash, undefined)
    })
    it('Deve comparar o hash com a senha e retornar true', () => {
        const result = passwordHelper.compareHash(MOCK_PASSWORD, MOCK_HASH)
        assert.deepStrictEqual(result, true)
    })
})