const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
// Configura para receber JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());









const UsuarioDB = require('./UsuarioDB');
const VistoriaDB = require('./VistoriaDB');
const FotoDB = require('./FotoDB');
const CaracteristicaDB = require('./CaracteristicaDB')

// não fui eu quem botou isso aqui
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

app.post('/vistorias', function (req, res){
    const vistoria = req.body;
    vistoria.situacao = 'Pendente'; //pra toda vistoria já aparecer pendete

    VistoriaDB.save(vistoria, function(vistoriaSalva){
        res.json(vistoriaSalva);
    });
});

app.put('/vistorias', function (req, res){
    const vistoria = req.body;

    VistoriaDB.update(vistoria, function (vistoriaAtualizada){
        res.json({msg: 'Vistoria atualizada com sucesso.'});
    });
});

app.delete('/vistorias/:id', function (req, res){
    const id = parseInt(req.params.id);

    if (isNaN(id)){
        return res.status(400).json({erro: 'ID inválida'});
    }

    console.log('Deletar vistoria ' + id);

    VistoriaDB.deleteById(id, function (affectedRows){
        res.json({msg: 'Vistoria excluida.'});
    });
});

// Rota das fotos

app.get('/vistorias/:id/fotos', function (req, res){
    const id = parseInt(req.params.id);

    FotoDB.getFotosByVistoria(id, function (fotos){
        res.json(fotos);
    });
});

app.post('/fotos', function (req, res){
    const foto = {
        vistoria_id: req.body.vistoria_id,
        posicao: req.body.posicao,
        imagem: req.body.imagem
    };

    FotoDB.save(foto, function (fotoSalva){
        res.json({id: fotoSalva.id, msg: 'Foto salva'});
    });
});

app.delete('/fotos/:id', function (req, res){
    const id = parseInt(req.params.id);

    FotoDB.deleteById(id, function (affectedRows){
        res,json({msg: 'Foto excluida'});
    });
});

// Rota das caracteristicas

app.get('/vistorias/:id/caracteristicas', function (req, res){
    const id = parseInt(req.params.id);

    CaracteristicaDB.getCaracteristicaByVistoria(id, function(lista){
        res.json(lista);
    });
});

app.post('/caracteristicas', function (req, res){
    const caracteristica = {
        vistoria_id: req.body.vistoria_id,
        descricao: req.body.descricao
    };

    CaracteristicaDB.save(caracteristica, function (salva){
        res.json(salva);
    });
});

app.delete('/caracteristicas/:id', function (req, res){
    const id = parseInt(req.parans.id);

    CaracteristicaDB.deleteById(id, function (affectedRows){
        res.json({msg: 'Caracteristica excluida'});
    });
});

// Inicializa servidor
const server = app.listen(3000, function () {

    console.log('Servidor iniciado em http://localhost:3000');

});