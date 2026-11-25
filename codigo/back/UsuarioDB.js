const Conexao = require('./Conexao');
const crypto = require('crypto');

// acessa tabela usuario
class UsuarioDB {

    // Transforma a senha em um código (hash) para não salvar a senha pura no banco ** foco aqui
    static criptografar(senha) {
        return crypto.createHash('sha256').update(String(senha)).digest('hex');
    }

    // buscar usuario pelo email
    static getUsuarioByEmail(email, callback) {
        let connection = Conexao.connect();
        let sql = "select id, nome, email, tipo from usuario where email = ?";
        let query = connection.query(sql, email, function (error, results, fields) {
            if (error) throw error;
            callback(results[0]);
        });
        console.log(query.sql);
        connection.end();
    }

    // Lista todos os avaliadores (usado no formulário do operador) ** atenção aqui
    static getAvaliadores(callback) {
        let connection = Conexao.connect();
        let sql = "select id, nome from usuario where tipo = 'avaliador' order by nome";
        let query = connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
        console.log(query.sql);
        connection.end();
    }

    // Faz o login: confere e-mail, senha e tipo de usuário ** foco aqui
    static login(email, senha, tipo, callback) {
        let connection = Conexao.connect();
        let sql = "select id, nome, email, tipo from usuario where email = ? and senha = ? and tipo = ?";
        let query = connection.query(sql, [email, UsuarioDB.criptografar(senha), tipo], function (error, results, fields) {
            if (error) throw error;
            callback(results[0]); // undefined se não encontrar
        });
        console.log(query.sql);
        connection.end();
    }

    // inserir novo usuario
    static save(usuario, callback) {
        let connection = Conexao.connect();
        usuario.senha = UsuarioDB.criptografar(usuario.senha);
        let sql = "insert into usuario set ?";
        let query = connection.query(sql, usuario, function (error, results, fields) {
            if (error) throw error;
            usuario.id = results.insertId;
            delete usuario.senha; // não devolve a senha
            callback(usuario);
        });
        console.log(query.sql);
        connection.end();
    }
}

module.exports = UsuarioDB;
