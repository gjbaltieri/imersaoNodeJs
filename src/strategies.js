class NotImplementedException extends Error {
    constructor(){
        super('Not implemented exception!')
    }
}
//
class ICrud {

    create(item){
        throw new NotImplementedException()
    }
    read(item){
        throw new NotImplementedException()
    }
    update(id, item){
        throw new NotImplementedException()
    }
    delete(id){
        throw new NotImplementedException()
    }
}
//
class MongoDB {
    create(item){
        return console.log('Item cadastrado com sucesso no MongoDB!')
    }
}
//
class Postgres {
    create(item){
        return console.log('Item cadastrado com sucesso no Postgres!')
    }
}
//
class ContextStrategy extends ICrud{
    constructor(database) {
        super()
        this._database = database
    }
    create(item){
        return this._database.create(item)
    }
    read(item){
        return this._database.read(item)
    }
    update(id, item){
        return this._database.update(id, item)
    }
    delete(id){
        return this._database.delete(id)
    }
}

const mongodb = new ContextStrategy(new MongoDB)

mongodb.create()

const postgres = new ContextStrategy(new Postgres)

postgres.create()