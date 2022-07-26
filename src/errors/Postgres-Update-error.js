class UpdateError extends Error {
    constructor(){
        super('Houve um erro ao atualizar')
    }    
}

module.exports = UpdateError