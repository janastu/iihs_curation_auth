#superlogin-docker
[superlogin](https://github.com/colinskow/superlogin) client for Auth endpoints. 



Superlogin: [@colinskow](https://github.com/colinskow)

DOCKER Superlogin Services for IIHS Application

This Service is used for following things

1.Registration 

2.Login Forgot Password 

3.Reset Password

4.Send Email

5.Logout



Superlogin has the following Configutations options to be done 

1.DBServer

DB Server configuration allows Curation Auth to be configured with the given couch db Database as shown below


    dbServer: {
    protocol: dbprotocol,            //(http)
    host: dbhost,                   //(http://mmcouch.test.openrun.net)( in local 192.168.99.100:5984)
    user: dbuser,                    //User name for Couchdb Database
    password: dbpassword,            //Password for Couchdb Database
    userDB:dbuserDB,                 //Database Name
    couchAuthDB:dbcouchAuthDB         //
  },

2.UserDB

UserDB configuration is used to store the create a separate database for individual users as shown below


    userDBs: {
      defaultDBs: {
        private: ['supertest']
      }
      }

3.Mailer

Mailer configuration allows to configure from which Email ID,Services like gmail,yahoo and the email id username and password as shown below



     mailer: {
       fromEmail: 'fromemailid',
     options: {
        service: 'Gmail',
          		auth: {
              user: 'username@gmail.com',
            pass: 'password'
               },
		  tls: {
        rejectUnauthorized: false // allow invalid certificates
        }
        }

4.Local

Local configuration allow to configure whether to send confirmation mail after user registration,can he able to login wihtout confirming email and after confirming the email to which path the user needs to be redirected(Like login page with status as true in query parameter /login?status=true) 

The fileds for local confugurations are


    local:{
	  sendConfirmEmail:'true',                //sends confirmation mail to user entered Email ID
	  requireEmailConfirm:'true',             // Requires for Login to the system whether he should be verify the Email ID
	  confirmEmailRedirectURL:loginurl        // After clicking on Verifiation link redirect path
	  }



From line Number 82 to 122 of index.js file is of Configuration for Superlogin Module

## Other Rest API Calls


 - Password Reset

The Rest API will be used to redirect the user to the reset page where user needs to enter the new password.

Superlogin send the link in the mail for reseting the password and after clicking on the email link ,the client is redirected back to the client reset page where he enters the new passord

    var token=req.query.token;
	  res.redirect(tokenurl+'/?token='+ token);     //token url=/#/resetpassword
								   
res.redirect is used to redirect to the given url 


 - Send Email
 
As the admin has the option of adding the users to the particualr group from Dashbaord Service, the added user needs to be notified through the mail saying the user is added to the group and click the link to register

After the users click the link, the user will be redirected to the User Registration page with non editable email id filed .

The below snippet is of Send Email using trasnporter.sendMail function to send emails

    var transporter = nodemailer.createTransport(config.mailer.options);

    var mailOptions = {
    from: 'fromemailid@gmail.com',
    to: email,
    subject: 'Admin Has Added to the Group',
    text: 'You have been added to group click link'+'<a href='+path,
    html:   '<p><b>Hello</b> You have been added to group <b>'+ groupname+'</b> click link for User Registration <a href       ='+path+'>Link</a></p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
    });
