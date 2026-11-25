var mysql = require('mysql2');


class Conexao {

    static connect() {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'vistoria',
            dateStrings: true // devolve as datas como texto
        });

        connection.connect();
        return connection;
    }
}

module.exports = Conexao;
