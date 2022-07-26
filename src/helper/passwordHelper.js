const Boom = require('@hapi/boom')
const Bcrypt = require('bcrypt')
const SALT = parseInt(process.env.SALT_PWD)

class passwordHelper {

    static hashCreate(password) {
        return Bcrypt.hashSync(password, SALT)
    }
    static compareHash(password, hash) {
        return Bcrypt.compareSync(password, hash)
    }
}

module.exports = passwordHelper