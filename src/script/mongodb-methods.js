// ADD 20000 documentos a coleção
for(let i = 0; i <= 20000; i++){
    db.herois.insert({
        nome: `Clone${i}`,
        poder: 'Soltar teia'
    })
    }
/////////////////////////////////////COUNT - conta o total de registros
db.herois.count()

///////////////////////////////////// Create 
db.herois.insert({
    nome: 'Batman',
    poder: 'Dinheiro'
})

/////////////////////////////////////READ
db.herois.find({ 
    nome: 'Batman'
}) // {} retorna todos os registros

db.herois.find({ 
    nome: 'Batman'
}).limit(5000).sort({nome: -1}) // {} retorna todos os primeiros 5000 registros em ordem crescente

db.herois.findOne({
    nome: 'Batman'
}) // retorna o primeiro registro


///////////////////////////////////// UPDATE

db.herois.update({_id: ObjectId("62d067847431836a15c1fcc1")}, {
    nome: 'Aquaman',
    poder: 'falar com os peixes'
})

///////////////////////////////////// DELETE

db.herois.remove({})