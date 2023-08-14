const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Amir6635', //make sure you put the correct password
  database: 'dbAquaS' 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');

  // Create a table to store user registrations if it doesn't exist
  const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
  )`;
  
  
  connection.query(createTableQuery, (err) => {
    if (err) throw err;
    console.log('Users table created');
  });

   // Create a table to store bookings if it doesn't exist
  const createBookingsTableQuery = `CREATE TABLE IF NOT EXISTS bookings (
    username VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date VARCHAR(10) NOT NULL,
    time VARCHAR(10) NOT NULL
  )`;
  
  
  connection.query(createBookingsTableQuery, (err) => {
    if (err) throw err;
    console.log('Bookings table created');
    connection.end();
  });
});


