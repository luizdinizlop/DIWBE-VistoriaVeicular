const Conexao = require('./Conexao');

// acessar tabela vistoria
class CaracteristicaDB {

    //retornar dados
    static getCaracteristicasByVistoria(vistoriaId, callback) {
        let connection = Conexao.connect();
        let sql = "select * from caracteristica where vistoria_id = ? order by id";
        let query = connection.query(sql, vistoriaId, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
        console.log(query.sql);
        connection.end();
    }

    //inserir
    static save(caracteristica, callback) {
        let connection = Conexao.connect();
        let sql = "insert into caracteristica set ?";
        let query = connection.query(sql, caracteristica, function (error, results, fields) {
            if (error) throw error;
            caracteristica.id = results.insertId;
            callback(caracteristica);
        });
        console.log(query.sql);
        connection.end();
    }

    // excluir
    static deleteById(id, callback) {
        let connection = Conexao.connect();
        let sql = "delete from caracteristica where id = ?";
        let query = connection.query(sql, id, function (error, results, fields) {
            if (error) throw error;
            callback(results.affectedRows);
        });
        console.log(query.sql);
        connection.end();
    }
}

module.exports = CaracteristicaDB;
