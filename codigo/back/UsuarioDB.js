const Conexao = require('./Conexao');
const crypto = require('crypto');

// acessa tabela usuario
class UsuarioDB {

   
    static criptografar(senha) {
        return crypto.createHash('sha256').update(String(senha)).digest('hex'); // evita salvar a senha real no banco
    }

    // buscar usuario pelo email
    static getUsuarioByEmail(email, callback) {
        let connection = Conexao.connect();
        let sql = "select id, nome, email, tipo from usuario where email = ?";
        let query = connection.query(sql, email, function (error, results, fields) {
            if (error) throw error;
            callback(results[0]); //traz somente o ususario encontrado
        });
        console.log(query.sql);
        connection.end();
    }

    // lista avaliadores
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

    // faz login - conferindo nome, email e tipo de usuario
    static login(email, senha, tipo, callback) {
        let connection = Conexao.connect();
        let sql = "select id, nome, email, tipo from usuario where email = ? and senha = ? and tipo = ?";
        let query = connection.query(sql, [email, UsuarioDB.criptografar(senha), tipo], function (error, results, fields) {
            if (error) throw error;
            callback(results[0]); 
        });
        console.log(query.sql);
        connection.end();
    }

    // inserir novo usuario
    static save(usuario, callback) {
        let connection = Conexao.connect();
        usuario.senha = UsuarioDB.criptografar(usuario.senha); // passa a senha criptografada
        let sql = "insert into usuario set ?";
        let query = connection.query(sql, usuario, function (error, results, fields) {
            if (error) throw error;
            usuario.id = results.insertId;
            delete usuario.senha; // remove a senha antes de mostrar
            callback(usuario);
        });
        console.log(query.sql);
        connection.end();
    }
}

module.exports = UsuarioDB;
