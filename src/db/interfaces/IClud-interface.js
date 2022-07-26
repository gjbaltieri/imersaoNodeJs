const { NotImplementedException } = require('../../errors/Not-implemented-Exception')

class ICrud {
    isConnect() {
        throw new NotImplementedException()
    }
    create(item) {
        throw new NotImplementedException()
    }
    read(item) {
        throw new NotImplementedException()
    }
    update(id, item) {
        throw new NotImplementedException()
    }
    delete(id) {
        throw new NotImplementedException()
    }
}

module.exports = ICrud
