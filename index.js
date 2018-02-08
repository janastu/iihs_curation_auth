 //require('dotenv').config()
var express = require('express');
var http = require('http'); 
var bodyParser = require('body-parser');
var logger = require('morgan');
var SuperLogin = require('superlogin');
var cors = require('cors')

var dbprotocol = process.env.dbprotocol;
console.log(dbprotocol);
var dbhost = process.env.dbhost;
console.log(dbhost);
var dbport=process.env.dbPort;
//var couchdbport=process.env.couchdbport;
var dbhostwidport=dbprotocol+dbhost+':'+dbport;

console.log(dbhostwidport); 

var dbuser = process.env.dbuser;
var dbpassword= process.env.dbpassword;
console.log(dbuser);
console.log(dbpassword);

var port=process.env.authPort;
//var couchdbdomain=dbprotocol + dbhost;
var dbuserDB =process.env.dbuserDB;
var dbcouchAuthDB=process.env.dbcouchAuthDB;
//console.log(couchdbdomain);
console.log(port);

var clienturl=process.env.clienturl;
var clienturlwithprotocol=dbprotocol + clienturl 
console.log(clienturlwithprotocol);

var app = express();
app.set('port', port|| 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




var config = {
  dbServer: {
    protocol: dbprotocol,
    host: dbhostwidport,          //Host name for Couchdb Database
    user: dbuser,                    //User name for Couchdb Database
    password: dbpassword,     //Password for Couchdb Database
    userDB:dbuserDB,
    couchAuthDB:dbcouchAuthDB
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
        }
    }
  },
  userDBs: {
    defaultDBs: {
      private: ['supertest']
    }
  }
}
 
// Initialize SuperLogin 
var superlogin = new SuperLogin(config);

app.use(function(req, res, next) {
  //var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  var allowedOrigins=clienturlwithprotocol;
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
}); 
// Mount SuperLogin's routes to our app 
app.get('/', function (req, res) {
  res.send('hello world')
})

app.use('/auth', superlogin.router);
 
http.createServer(app).listen(app.get('port'));

