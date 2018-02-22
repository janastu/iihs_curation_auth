 //require('dotenv').config()
var express = require('express');
var http = require('http'); 
var bodyParser = require('body-parser');
var logger = require('morgan');
var SuperLogin = require('superlogin');
var cors = require('cors')
var path = require('path');
var nodemailer = require('nodemailer');
/*
var dbprotocol = 'http://';
console.log(dbprotocol);
var dbhost = 'localhost:5984';
console.log(dbhost);
var dbport='5984';
//var couchdbport=process.env.couchdbport;
var dbhostwidport=dbhost+':'+dbport;

console.log(dbhostwidport); 

var dbuser = 'admin';
var dbpassword= 'admin';
console.log(dbuser);
console.log(dbpassword);

var port='3000';
//var couchdbdomain=dbprotocol + dbhost;
var dbuserDB ='sl-users';
var dbcouchAuthDB='_users';
//console.log(couchdbdomain);
console.log(port);

var clienturl='localhost:4200';
*/

var dbprotocol = process.env.dbprotocol;
console.log(dbprotocol);
var dbhost = process.env.dbhost;
console.log(dbhost);
var dbport=process.env.dbPort;
//var couchdbport=process.env.couchdbport;
var dbhostwidport=dbhost+':'+dbport;

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
var loginpath='/#/login';
var registrationpath='/#/signup/'
var loginurl=dbprotocol+ clienturl+loginpath;
var registrationurl=dbprotocol+clienturl+registrationpath;
console.log(loginurl);
console.log(registrationurl);


var app = express();
app.set('port', port|| 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




var config = {
	 emails: {
    // Customize the templates for the emails that SuperLogin sends out
    confirmEmail: {
      subject: 'Please confirm your email',
      // Remember to use the correct path relative to where your custom config file is located
      template: path.join(__dirname, './templates/email/confirm-email.ejs'),
      // 'text' or 'html'
      format: 'text'
    }
	},
	local:{
	sendConfirmEmail:'true',
	requireEmailConfirm:'true',
	confirmEmailRedirectURL:loginurl
	},
	
  dbServer: {
    protocol: dbprotocol,//(http)
    host: dbhost,//(http://mmcouch.test.openrun.net)( in local 192.168.99.100:5984)
    user: dbuser,                    //User name for Couchdb Database
    password: dbpassword,     //Password for Couchdb Database
    userDB:dbuserDB,
    couchAuthDB:dbcouchAuthDB
  },
  mailer: {
    fromEmail: 'demotestuser43@gmail.com',
    options: {
      service: 'Gmail',
        		auth: {
          user: 'demotestuser43@gmail.com',
          pass: 'demotestuser@43'
        },
		tls: {
        rejectUnauthorized: false // allow invalid certificates
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
app.get('/sendemail',function(req,res){
    res.send(req.query.email)
	console.log(req.query.email);
	
	var email=req.query.email;
	console.log(email);
	
	var path=registrationurl+'?email='+email;
	console.log(path);
	//superlogin.sendmail(config.emails.confirmEmail,email,path);
    
	var transporter = nodemailer.createTransport(config.mailer.options);

var mailOptions = {
  from: 'demotestuser43@gmail.com',
  to: email,
  subject: 'Admin Has Added to the Group',
  text: 'You have been added to group click link'+'<a href='+path
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
});

app.use('/auth', superlogin.router);
 

http.createServer(app).listen(app.get('port'));

