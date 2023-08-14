// The purpose of this file is to manage the project sessions.
// @author Dr. Haitham Yaish
// @date 11 June 2023
const session = require('express-session');
var mySession;


exports.createSession = function (req, username) {
  req.session.username = username;
  console.log("Session Created.");
};

exports.deleteSession = function (req) {
  req.session.destroy();
  console.log("Session Deleted.");
};


exports.setMySession = function (req, username) {
    req.session.userName = username;
    mySession = req.session;
    console.log("Session Created.");
  };
  

exports.getMySession = function(){
    return mySession;
};

