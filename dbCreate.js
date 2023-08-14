const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Amir6635', //make sure you put the correct password
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
  connection.query('CREATE DATABASE IF NOT EXISTS dbAquaS', (err) => {
    if (err) throw err;
    console.log('Database created');
    connection.end();
  });
});
