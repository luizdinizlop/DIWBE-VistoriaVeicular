var mysql = require('mysql2');


class Conexao {

    static connect() {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Fran880537@',
            database: 'vistoria',
            dateStrings: true // devolve as datas como texto
        });

        connection.connect();
        return connection;
    }
}

module.exports = Conexao;
