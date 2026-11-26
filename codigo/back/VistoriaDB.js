const Conexao = require('./Conexao');

// acessa tabela vistoria
class VistoriaDB {

    // Retorna todas as vistorias (com o nome do avaliador) ** atenção aqui
    static getVistorias(callback) {
        let connection = Conexao.connect();
        let sql = "select v.*, u.nome as avaliador_nome from vistoria v " +
                  "left join usuario u on u.id = v.avaliador_id order by v.id desc";
        let query = connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
        console.log(query.sql);
        connection.end();
    }

    // Retorna as vistorias de um avaliador (sem as canceladas)
    static getVistoriasByAvaliador(avaliadorId, callback) {
        let connection = Conexao.connect();
        let sql = "select * from vistoria where avaliador_id = ? and situacao <> 'Cancelado' order by data_hora desc";
        let query = connection.query(sql, avaliadorId, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
        console.log(query.sql);
        connection.end();
    }

    // retornar vistoria pelo id
    static getVistoriaById(id, callback) {
        let connection = Conexao.connect();
        let sql = "select v.*, u.nome as avaliador_nome from vistoria v " +
                  "left join usuario u on u.id = v.avaliador_id where v.id = ?";
        let query = connection.query(sql, id, function (error, results, fields) {
            if (error) throw error;
            callback(results[0]);
        });
        console.log(query.sql);
        connection.end();
    }

    // inserir nova vistoria
    static save(vistoria, callback) {
        let connection = Conexao.connect();
        let sql = "insert into vistoria set ?"; // mapeia o objeto para colunas e valores
        let query = connection.query(sql, vistoria, function (error, results, fields) {
            if (error) throw error;
            vistoria.id = results.insertId;
            callback(vistoria);
        });
        console.log(query.sql);
        connection.end();
    }

    // atualiza uma vistoria
    static update(vistoria, callback) {
        let connection = Conexao.connect();
        let sql = "update vistoria set ? where id = ?";
        let id = vistoria.id;
        let query = connection.query(sql, [vistoria, id], function (error, results, fields) {
            if (error) throw error;
            callback(vistoria);
        });
        console.log(query.sql);
        connection.end();
    }

    // exclui uma vistoria pelo id
    static deleteById(id, callback) {
        let connection = Conexao.connect();
        let sql = "delete from vistoria where id = ?";
        let query = connection.query(sql, id, function (error, results, fields) {
            if (error) throw error;
            callback(results.affectedRows);
        });
        console.log(query.sql);
        connection.end();
    }
}

module.exports = VistoriaDB;
