require('dotenv').config()
const { Sequelize } = require('sequelize')

const SSL_DB = process.env.SSL_DB === 'true' ? true : undefined
const SSL_DB_REJECT = process.env.SSL_DB_REJECT === 'false' ? false : undefined

let dialectOptions = {}
if (SSL_DB) {
    dialectOptions = {
        ssl: {
            require: SSL_DB,
            rejectUnauthorized: SSL_DB_REJECT,
        }
    };
};

const Connection = new Sequelize(process.env.POSTGRES_URL, {
    quoteIdentifiers: false,
    logging: false,
    dialectOptions,
});
module.exports = Connection