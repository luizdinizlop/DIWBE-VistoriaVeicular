const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
// Configura para receber JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());









const PetDB = require('./PetDB');




// Rota principal
app.get('/', function (req, res) {

    res.send('API dos Pets');

});

// GET /pets
app.get('/pets', function (req, res) {

    PetDB.getPets(function (pets) {

        res.json(pets);

    });

});

// GET /pets/:id
app.get('/pets/:id', function (req, res) {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {

        return res.status(400).json({
            erro: 'ID inválido'
        });

    }

    PetDB.getPetById(id, function (pet) {

        if (!pet) {

            return res.status(404).json({
                erro: 'Pet não encontrado'
            });

        }

        res.json(pet);

    });

});

// GET /pets/tipo/:tipo
app.get('/pets/tipo/:tipo', function (req, res) {

    const tipo = req.params.tipo;

    PetDB.getPetsByTipo(tipo, function (pets) {

        res.json(pets);

    });

});

// POST /pets
app.post('/pets', function (req, res) {

    const pet = req.body;

    PetDB.save(pet, function (petSalvo) {

        res.status(201).json(petSalvo);

    });

});

// PUT /pets
app.put('/pets', function (req, res) {

    const pet = req.body;

    if (!pet.id) {

        return res.status(400).json({
            erro: 'Informe o ID do pet'
        });

    }

    PetDB.update(pet, function (petAtualizado) {

        res.json({
            msg: 'Pet atualizado com sucesso',
            pet: petAtualizado
        });

    });

});

// DELETE /pets/:id
app.delete('/pets/:id', function (req, res) {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {

        return res.status(400).json({
            erro: 'ID inválido'
        });

    }

    PetDB.deleteById(id, function (affectedRows) {

        if (affectedRows === 0) {

            return res.status(404).json({
                erro: 'Pet não encontrado'
            });

        }

        res.json({
            msg: 'Pet removido com sucesso'
        });

    });

});

// Inicializa servidor
const server = app.listen(3000, function () {

    console.log('Servidor iniciado em http://localhost:3000');

});