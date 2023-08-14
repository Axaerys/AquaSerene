
//importing libraries
const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
var sessUser = ''; // variable to hold the session username
const fs = require('fs');

//to store the html files, to be used later to update the html
const myAccPath = './myAccount.html';
const myAccPage = fs.readFileSync(myAccPath, 'utf8');

const myHomePath = './home.html';
const myHomePage = fs.readFileSync(myHomePath, 'utf8');

const myBookPath = './bookingpage.html';
const myBookPage = fs.readFileSync(myBookPath, 'utf8');

const myEditBookPath = './editBookingPage.html';
const myEditBookPage = fs.readFileSync(myEditBookPath, 'utf8');



//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./'));


//connecting to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Amir6635', //make sure the correct password is inserted
    database: 'dbAquaS' 
  });

  //Setting the route for the landing page to home
  app.get('/', (req, res) => { 
    // if user hasn't logged in
    if (sessUser == '' || sessUser == null) {
      res.redirect('/home.html');

    } else {  //if the user has logged in

        //html code for login page is modified
      const modifiedTemplate = myHomePage
            //removing the log in button by setting it to hidden and disabled
            .replace('<a href="./login.html"><button class="tab-btn"><span>Login</span></button></a>', `<a href="./login.html"><button class="tab-btn" hidden disabled><span>Login</span></button></a>`);
            //sending the modified html page
            res.send(modifiedTemplate);
    }
  });

  //Route for home
  app.get('/home', (req, res) => { 
    // if user hasn't logged in
    if (sessUser == '' || sessUser == null) {
      res.redirect('/home.html');
      
    } else {//if the user has logged in
      //html code for login page is modified
      const modifiedTemplate = myHomePage
            //removing the log in button by setting it to hidden and disabled
            .replace('<a href="./login.html"><button class="tab-btn"><span>Login</span></button></a>', `<a href="./login.html"><button class="tab-btn" hidden disabled><span>Login</span></button></a>`)
            //sending the modified html page
            res.send(modifiedTemplate);
    }
  });

  // Route for booking page
  app.get('/bookingpage', (req, res) => {
  
    if (sessUser == '' || sessUser == null) {
      //sending error 105 back (indicates user hasn't logged in)
      res.redirect('/login.html?error=105');
    } else {
      const modifiedTemplate = myBookPage
            .replace('<a href="./login.html"><button class="tab-btn"><span>Login</span></button></a>', `<a href="./login.html"><button class="tab-btn" hidden disabled><span>Login</span></button></a>`)
            res.send(modifiedTemplate);
    }
  });

  //Route for my account page
  app.get('/myAccount', (req, res) => {
  
    if (sessUser == '' || sessUser == null) {
      //sending error 105 back (indicates user hasn't logged in)
      res.redirect('/login.html?error=105');
    } else {

      //Retrieving data from the database using select queries
      const selectUserQuery = `SELECT username, phone, email FROM users WHERE username LIKE ?`;
      var accUser = '';
      var accPhone = '';
      var accEmail = '';
      
      // selecting the bookings of the logged in user that have a date less than the current date
      const selectAccHistQuery = `SELECT service, date, time FROM bookings WHERE username LIKE ? AND DATE(date) < DATE(?)`;

      var histService = [];
      var histDate = [];
      var histTime = [];
      var price = [];
      var historyDivs;

      // selecting the bookings of the logged in user that have a date more than or equal to the current date
      const selectUpcomingQuery = `SELECT service, date, time FROM bookings WHERE username LIKE ? AND DATE(date) >= DATE(?)`;

      var upService = [];
      var upDate = [];
      var upTime = [];
      var upPrice = [];
      var upDivs;
      var editBool = 1;


      // Get current date
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      // Formatting the date
      const formattedDate = `${year}-${month}-${day}`;



      // this query retrieves account details for the logged in user
      connection.query(selectUserQuery, [sessUser], (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        accUser = result[0].username;
        accPhone = result[0].phone;
        accEmail = result[0].email;
  
        //this query retrieves booking history of the logged in user
        connection.query(selectAccHistQuery, [sessUser, formattedDate], (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
  
          // For loop to save and display the previous bookings
          for (var i = 0; i < result.length; i++) {
            histService[i] = result[i].service;
            histDate[i] = result[i].date;
            histTime[i] = result[i].time;
            if (histService[i] == "Massage") {price[i] = 250};
            if (histService[i] == "Facial") {price[i] = 150};
            if (histService[i] == "BoTrea") {price[i] = 300};
            if (histService[i] == "NailCare") {price[i] = 100};
            if (histService[i] == "Waxing") {price[i] = 200};
            if (histService[i] == "RelTher") {price[i] = 250};
            if (histService[i] == "WellCon") {price[i] = 150};
          }
          
          // updating the html using the map function for each booking
          historyDivs = histService.map((service, i) => {
            return `
              <div class="history" id="his${i + 1}">
                <label>
                  <span class="label-text">Spa Service:</span>
                  <span class="value-text">${histService[i]}</span>
                </label>
                <label>
                  <span class="label-text">Date Visited:</span>
                  <span class="value-text" style="position: relative; left: 40px;">${histTime[i]}</span>
                  <span class="value-text">${histDate[i]}</span>
                </label>
                <label>
                  <span class="label-text">Amount Paid:</span>
                  <span class="value-text">${price[i]}</span>
                </label>
              </div>
            `;
          });

        });

        //this query retrieves upcoming booking of the logged in user
        connection.query(selectUpcomingQuery, [sessUser, formattedDate], (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
  
          for (var i = 0; i < result.length; i++) {
            upService[i] = result[i].service;
            upDate[i] = result[i].date;
            upTime[i] = result[i].time;
            if (upService[i] == "Massage") {upPrice[i] = 250};
            if (upService[i] == "Facial") {upPrice[i] = 150};
            if (upService[i] == "BoTrea") {upPrice[i] = 300};
            if (upService[i] == "NailCare") {upPrice[i] = 100};
            if (upService[i] == "Waxing") {upPrice[i] = 200};
            if (upService[i] == "RelTher") {upPrice[i] = 250};
            if (upService[i] == "WellCon") {upPrice[i] = 150};
          }
          
          // this is same as the previous one but with one alteration being that
          // the retrieved details are saved into the url using encodeURIComponent incase of cancelBooking being called
          upDivs = upService.map((service, i) => { 
            return `
              <div class="bookings" id="book${i + 1}">
              <a href="./cancelBooking?service=${encodeURIComponent(upService[i])}&date=${encodeURIComponent(upDate[i])}&time=${encodeURIComponent(upTime[i])}"><button class="delete" id="cancel${i + 1}" onclick="removeDiv(this)"> Cancel Reservation</button></a>
              <a href="./editBookingPage?editBool=${encodeURIComponent(editBool)}&editService=${encodeURIComponent(upService[i])}&editDate=${encodeURIComponent(upDate[i])}&editTime=${encodeURIComponent(upTime[i])}"><button class="edit" id="edit${i + 1}" onclick="editDiv(this)"> Edit Reservation</button></a>  
              <label>
                  <span class="label-text">Spa Service:</span>
                  <span class="value-text">${upService[i]}</span>
                </label>
                <label>
                  <span class="label-text">Date Visited:</span>
                  <span class="value-text" style="position: relative; left: 370px;">${upTime[i]}</span>
                  <span class="value-text">${upDate[i]}</span>
                </label>
                <label>
                  <span class="label-text">Amount Paid:</span>
                  <span class="value-text">${upPrice[i]}</span>
                </label>
              </div>
            `;
          });
  
          // sending the modified html code
          const modifiedTemplate = myAccPage
            .replace('<span id="accUser"></span>', `<span id="accUser">${accUser}</span>`)
            .replace('<span id="accPhone"></span>', `<span id="accPhone">${accPhone}</span>`)
            .replace('<span id="accEmail"></span>', `<span id="accEmail">${accEmail}</span>`)
            .replace('<a href="./login.html"><button class="tab-btn"><span>Login</span></button></a>', `<a href="./login.html"><button class="tab-btn" hidden disabled><span>Login</span></button></a>`)
            .replace('<div class="BG-history">', `<div class="BG-history">${historyDivs.join('')}`)
            .replace('<div class="BG-booking">', `<div class="BG-booking">${upDivs.join('')}`);
          res.send(modifiedTemplate);
        });
      });
    }
  });
  
  // route to cancelBooking function
  app.get('/cancelBooking', (req, res) => {
    const service = req.query.service;
    const date = req.query.date;
    const time = req.query.time;

    // deleting the user selected booking
    const deleteUserQuery = `DELETE FROM bookings where username LIKE ? AND service like ? AND date like ? AND time like ? `;
    
    connection.query(deleteUserQuery, [sessUser, service, date, time], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("query deleted!");
      res.redirect('/myAccount');
    });
  });
  
  // variables to store booking details
      var editService;
      var editDate;
      var editTime;
  app.get('/editBookingPage', (req, res) => {
    
    if (sessUser == '' || sessUser == null) {
      //sending error 105 back (indicates user hasn't logged in)
      res.redirect('/login.html?error=105');
    } else {

      editService = req.query.editService;
      editDate = req.query.editDate;
      editTime = req.query.editTime;

      const modifiedTemplate = myEditBookPage
            .replace('<a href="./login.html"><button class="tab-btn"><span>Login</span></button></a>', `<a href="./login.html"><button class="tab-btn" hidden disabled><span>Login</span></button></a>`)
            res.send(modifiedTemplate);
    }
  });
 
  app.post('/editBook', (req, res) => {
    const { serviceEditPage, dateInputEdit, timeInputEdit } = req.body; // getting the values from the HTML body

    // updating the user selected booking
    const updateUserQuery = `UPDATE bookings SET service = ?, date = ?, time = ? WHERE username = ? AND service = ? AND date = ? AND time = ?`;

    connection.query(updateUserQuery, [serviceEditPage, dateInputEdit, timeInputEdit, sessUser, editService, editDate, editTime], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      res.redirect('/myAccount'); // upon success, redirect to my account page
    });
  });

  // after user clicks sign out they are redirected to home and sessUser is set to empty
  app.get('/signOut', (req, res) => {
    sessUser = '';
    res.redirect('/home');
  });

// Route to handle user registration
app.post('/signup', (req, res) => {
  console.log('Received signup request');
  const { email, username, phone, password, confirm_password } = req.body; //getting the values from the html body


  // Password validation Regular Expressions
  const specialCharRegex = /[!@#$%^&*]/;
  const letterRegex = /[a-zA-Z]/;
  const numberRegex = /[0-9]/;
  const isValidPassword = password.length >= 8 && specialCharRegex.test(password) && letterRegex.test(password) && numberRegex.test(password);

  let isValid = true;

  // Checking the credentials against the database
  const userQuery = 'SELECT * FROM users WHERE username LIKE ?';
  const emailQuery = 'SELECT * FROM users WHERE email LIKE ?';

  connection.query(userQuery, [username], (error, userResults) => {
    if (error) {
      console.error('Error executing the user query:', error);
      res.redirect('/signupPage.html?error=105'); //unkown error
      return;
    }

    // Checking if a matching user is found
    if (userResults.length > 0) {
      isValid = false;
      res.redirect('/signupPage.html?error=100'); // username already exists
      return;
    }

    connection.query(emailQuery, [email], (error, emailResults) => {
      if (error) {
        console.error('Error executing the email query:', error);
        res.redirect('/signupPage.html?error=105');
        return;
      }

      // Checking if a matching user is found
      if (emailResults.length > 0) {
        isValid = false;
        res.redirect('/signupPage.html?error=104'); // email already exists
        return;
      }

      if (!isValidPassword) {
        isValid = false;
        res.redirect('/signupPage.html?error=101'); // invalid password input
        return;
      }

      // Phone number validation
      const phoneRegex = /^05.{8}$/; // Regex pattern: starts with "05", followed by any 8 characters
      if (!phoneRegex.test(phone)) {
        isValid = false;
        res.redirect('/signupPage.html?error=102'); // phone number pattern not followed
        return;
      }

      // Confirm password validation
      if (password !== confirm_password) {
        isValid = false;
        res.redirect('/signupPage.html?error=103'); // password and confirm password do not match
        return;
      }
      
     

      if (isValid) { // if no errors occured
        // Inserting user data into the 'users' table
        const insertUserQuery = `INSERT INTO users (email, username, phone, password) VALUES (?, ?, ?, ?)`;

        connection.query(insertUserQuery, [email, username, phone, password], (err, result) => {
          if (err) {
            console.error(err);
            res.redirect('/signupPage.html?error=104');
            return;
          }

          console.log('User registered successfully');
          res.redirect('/login.html');
        });
      }
    });
  });
});



// ROute to handle login
  app.post('/login', (req, res) => {
    console.log('Received login request');
    const { usernameLogin, passwordLogin } = req.body; //getting the values from the html body
  
    // Checking the credentials against the database
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [usernameLogin, passwordLogin], (error, results) => {
      if (error) {
        console.error('Error executing the query:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      // Checking if a matching user is found
      if (results.length > 0) { // if yes then login
        console.log('Login successful');
        sessUser = usernameLogin;
        res.redirect('/home');
      } else { //if not redirect back to login page
        res.redirect('/login.html?error=invalid'); // inavlid username or password
      }
    });
  });



// route to handle bookings
app.post('/book', (req, res) => {
  const { service, dateInput, timeInput } = req.body; // getting the values from the HTML body

  console.log('Received booking request');
    // Inserting user data into the 'bookings' table
    const insertUserQuery = `INSERT INTO bookings (username, service, date, time) VALUES (?, ?, ?, ?)`;

    connection.query(insertUserQuery, [sessUser, service, dateInput, timeInput], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      res.redirect('/myAccount'); // upon success, redirect to my account page
    });
  
});



// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

