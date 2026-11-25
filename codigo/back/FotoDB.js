const Conexao = require('./Conexao');

//acessar tabela fotos
class FotoDB {

    // retornar fotos
    static getFotosByVistoria(vistoriaId, callback) {
        let connection = Conexao.connect();
        let sql = "select * from foto where vistoria_id = ?";
        let query = connection.query(sql, vistoriaId, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
        connection.end();
    }

    // salva foto
    static save(foto, callback) {
        let connection = Conexao.connect();
        let sqlApagar = "delete from foto where vistoria_id = ? and posicao = ?";
        connection.query(sqlApagar, [foto.vistoria_id, foto.posicao], function (error) {
            if (error) throw error;
        });
        let sql = "insert into foto set ?";
        connection.query(sql, foto, function (error, results, fields) {
            if (error) throw error;
            foto.id = results.insertId;
            callback(foto);
        });
        console.log("Foto salva: vistoria " + foto.vistoria_id + " - " + foto.posicao);
        connection.end();
    }

    // exclui foto pelo id
    static deleteById(id, callback) {
        let connection = Conexao.connect();
        let sql = "delete from foto where id = ?";
        let query = connection.query(sql, id, function (error, results, fields) {
            if (error) throw error;
            callback(results.affectedRows);
        });
        console.log(query.sql);
        connection.end();
    }
}

module.exports = FotoDB;
