const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
// Configura para receber JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());









const UsuarioDB = require('./UsuarioDB');
const VistoriaDB = require('./VistoriaDB');
const { resourceLimits } = require('node:worker_threads');


// Rota principal
app.get('/', function (req, res) {

    res.send('API dos usuarios');

});

app.get('/avaliadores', function (req, res) {

    UsuarioDB.getAvaliadores(function (avaliadores) {

        res.json(avaliadores);

    });

});

// POST /pets
app.post('/usuarios', function (req, res) {

    const usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        tipo: req.body.tipo
    };

    if (!usuario.nome || !usuario.email || !usuario.senha || usuario.tipo){
        return res.status(400).json({erro: 'Preencher todos os campos.'});
    }

    UsuarioDB.getUsuarioByEmail(usuario.email, function (existente) {
        if (existente){
            return res.status(400).json({erro: 'Este email já está cadastrado.'});
        }

        UsuarioDB.save(usuario, function (usuarioSalvo){
            res.status(201).json(usuarioSalvo);
        });
    });
});

app.post('/login', function(req, res){
    UsuarioDB.login(req.body.email, req.body.senha, req.body.tipo, function(usuario) {
        if (!usuario){
            return res.status(401).json({erro: 'Email ou senha inválidos;'});
        }
        res.json(usuario);
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


//rota das visorias

app.get('/vistorias', function (req, res){
    VistoriaDB.getVistorias(function (vistorias){
        res.json(vistorias);
    });
});

app.get('/vistorias/avaliador/:id', function (req, res){
    const id = parseInt(req.params.id);

    if (isNaN(id)){
        return res.status(400).json({erro: 'ID inválido'});
    }

    VistoriaDB.getVistoriaByAvaliador(id, function (vistorias){
        res.json(vistorias);
    });
});

app.get('/vistorias/:id', function (req, res){
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({erro: 'ID inválido'});
    }

    VistoriaDB.getVistoriaByID(id, function(vistoria){
        if (!vistoria){
            return res.status(404).json({erro: 'Vistoria não encontrada'});
        }
        res.json(vistoria);
    });
});

// Inicializa servidor
const server = app.listen(3000, function () {

    console.log('Servidor iniciado em http://localhost:3000');

});