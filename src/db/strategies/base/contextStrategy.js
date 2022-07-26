const ICrud = require('../../interfaces/IClud-interface')

class ContextStrategy extends ICrud {
    constructor(database) {
        super()
        this._database = database
    }
    static connect() {
        return this._database.connect()
    }
    isConnect() {
        return this._database.isConnect()
    }
    create(item) {
        return this._database.create(item)
    }
    read(item, skip, limit) {
        return this._database.read(item, skip, limit)
    }
    update(id, item, upsert = false) {
        return this._database.update(id, item, upsert)
    }
    delete(id) {
        return this._database.delete(id)
    }
    close(){
        this._database.close()
    }
}

module.exports = ContextStrategy