
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'worldbank_db_test'
});

connection.connect(function(err){
  if (err) {
    console.log(err.stack);
  } 
  console.log(connection.threadId);
});

module.exports = connection;