const IClud = require('../../interfaces/IClud-interface')
const UpdateError = require('../../../errors/Postgres-Update-error')
const Connection = require('../../../connection/postgres')

class Postgres extends IClud {
    constructor(connection, schema) {
        super()
        this.connection = connection
        this._schema = schema
    }
    static async connect() {
        const connection = Connection
        return connection
    }

    isConnect() {
        try {
            this.connection.authenticate()
            return true
        } catch (error) {
            console.error('FAIL!', error)
            return false
        }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync()
        return model
    }
    async create(item) {
        const { dataValues } = await this._schema.create(item, { raw: true })
        return dataValues
    }

    async read(item = {}) {
        return await this._schema.findAll({ where: item, raw: true })
    }
    async update(item, id, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return this._schema[fn](item, {
            where:  id 
        })
    }
    async delete (id) {
    const query = id ? { id } : {}
    return await this._schema.destroy({
        where: query
    })
}
}
module.exports = Postgres
