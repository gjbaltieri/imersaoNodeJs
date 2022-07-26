const IClud = require('../../interfaces/IClud-interface')
const { close, connect } = require('../../../connection/mongodb-mongoose')

class MongoDB extends IClud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }
    async connect() {
        return connect()
    }
    async create(item) {
        const result = await this._schema.create(item)
        return result
    }
    async read(item, limit, skip) {
        return await this._schema.find(item).limit(limit).skip(skip)
    }
    async update(_id, item) {
        return await this._schema.updateOne({ _id }, { $set: item })
    }
    async delete(_id) {
        return await this._schema.deleteOne({ _id })
    }
    async close() {
        // await this._schema.deleteMany({})
        return await close()
    }
}
module.exports = MongoDB