const baseRoute = require('./base/baseRoutes')
const Joi = require('joi')
const Boom = require('@hapi/boom')

const failAction = (req, headers, error) => {
  throw error
}
const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown()

class HeroRoutes extends baseRoute {
  constructor(db) {
    super()
    this.db = db
  }
  read() {
    return {
      path: '/herois',
      method: 'GET',
      options: {
        description: 'Deve retornar herois',
        notes: 'Retorna herois',
        tags: ['api'],
        validate: {
          failAction,
          headers,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          })
        }
      },
      handler: async (req, handers) => {
        try {
          const { nome, limit, skip } = req.query
          const query = nome ? { nome: { $regex: `.*${nome}*.` } } : {}
          return await this.db.read(nome ? query : {}, limit, skip)
        } catch (error) {
          console.error('DEU RUIM', error)
          return Boom.internal('Houve um erro interno no servidor')
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      options: {
        description: 'Deve criar um heroi',
        notes: 'Cria um heroi com os dados requeridos',
        tags: ['api'],
        validate: {
          failAction,
          headers,
          payload: Joi.object({
            poder: Joi.string().min(3).max(100),
            nome: Joi.string().min(3).max(100)
          })
        }
      },
      handler: async (req) => {
        try {
          const { nome, poder } = req.payload
          const result = await this.db.create({ nome, poder })
          return {
            message: 'Herói cadastrado com sucesso!',
            _id: result._id
          }
        } catch (error) {
          console.error('DEU RUIM', error)
          throw Boom.internal('Houve um erro interno no servidor')
        }
      }
    }
  }
  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      options: {
        description: 'Deve atualizar o heroi',
        notes: 'Atualiza um heroi pelo ID',
        tags: ['api'],
        validate: {
          failAction,
          headers,
          params: Joi.object({
            id: Joi.string().required()
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(3).max(100)
          })

        },
      },
      handler: async (req) => {
        try {
          const { id } = req.params
          const { payload } = req
          const dadosString = JSON.stringify(payload)
          const Dados = JSON.parse(dadosString)

          const result = await this.db.update(id, Dados)
          if (result.modifiedCount !== 1) {
            return Boom.preconditionFailed('Não foi possível atualizar o heroi!')
          }
          return {
            message: 'Heroi atualizado com sucesso!'
          }
        }
        catch (error) {
          console.error('DEU RUIM', error)
          return Boom.preconditionFailed('Houve um erro interno no servidor')
        }
      }
    }
  }
  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      options: {
        description: 'Deve deletar um heroi',
        notes: 'Deleta um herois pelo ID',
        tags: ['api'],
        validate: {
          failAction,
          headers,
          params: Joi.object({
            id: Joi.string().required()
          })
        }
      },
      handler: async (req) => {
        try {
          const { id } = req.params
          const result = await this.db.delete(id)
          if (result.deletedCount !== 1) {
            return Boom.preconditionFailed('Não foi possivel remover o heroi!')
          }
          return {
            message: 'Heroi removido com sucesso!'
          }
        } catch (error) {
          console.error('DEU RUIM', error)
          return Boom.internal('Houve um erro interno no servidor')
        }
      }
    }
  }
}
module.exports = HeroRoutes
