require('dotenv')
const baseRoute = require('./base/baseRoutes')
const Joi = require('joi')
const Boom = require('@hapi/boom')
const Jwt = require('jsonwebtoken')
const passwordHelper = require('../helper/passwordHelper')


const MOCK_LOGIN = {
    username: 'teste123',
    password: '123456'
}


const failAction = (req, headers, error) => {
    throw error
}

class authRoutes extends baseRoute {
    constructor(token_secret, db) {
        super()
        this.token_secret = token_secret
        this.db = db
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            options: {
                auth: false,
                description: 'Deve retornar um JWT',
                notes: 'retorna um token',
                tags: ['api'],
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (req) => {
                const { username, password } = req.payload
                const [user] = await this.db.read({
                    username: username.toLowerCase()
                })
                if (!user) {
                    return Boom.unauthorized('Usuário ou senha inválidos!')
                }
                const match = await passwordHelper.compareHash(password, user.password)
                if (!match) {
                    return Boom.unauthorized('Usuário ou senha inválidos!')
                }
                const token = Jwt.sign({
                    id: user.id,
                    username: user.username,
                }, this.token_secret)
                return { token }
            }
        }
    }
}

module.exports = authRoutes