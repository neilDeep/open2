var express = require('express');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var cors = require('cors');
var bodyParser = require('body-parser');



var router = express.Router();

var app = express();
app.use(cors());

//adds a new user to database
router.post('/newuser', function(request, response){

  var username = request.body.username;
  var password = request.body.password;
  var pic = request.body.pic;
  var hashedPass = bcrypt.hashSync(password, 10);

  user = {username: username, password: hashedPass, picture: pic};

  db.query('INSERT INTO Users SET ?', user, function(err, results){
    if(err){
      response.sendStatus(500);
    }else{
      db.query('INSERT INTO Users SET ')
      response.send('/login');
    }
  })
});

module.exports = router;
//img src=data:type=base64/png:fhdiuasfhiueahfuidsnaifuhwaefhdsiahfuidashfidsuafhdsuagfdusahfdsuafhdsa