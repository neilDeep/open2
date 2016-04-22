var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db.js');
var cors = require('cors');

var app = express();
app.use(bodyParser())
app.use(cors());

  //db.query('SELECT Users.username, Events.eventname, Events.timestamp, UserEvents.id, UserEvents.created_by
  // FROM Users INNER JOIN UserEvents ON 
  	//Users.id = UserEvents.user_id INNER JOIN Events ON Events.id = UserEvents.event_id ORDER BY event_id', function(err, rows){
//

// 'SELECT User.username FROM Users INNER JOIN Friends ON (`user_id1` = ? OR `user_id2` = ?)'

// 'SELECT u.username FROM Users u INNER JOIN Friends f1 ON f1.user_id1=u.id INNER JOIN Friends f2 ON 
// f2.user_id1 = f1.user_id2 AND f2.user_id2 = f1.user_id1 WHERE f2.user_id1 = ?'

router.post('/', function(request, response) {
	console.log("THIS IS THE REQUEST BODY YOUVE BEEN LOOKING FOR!!!", request.body);
var requestedUser = request.body.id;
db.query("SELECT u.username FROM Users u INNER JOIN (SELECT f1.user_id1 AS user, f1.user_id2 AS friend FROM Friends f1 INNER JOIN Friends f2 ON (f1.user_id1 = f2.user_id2 AND f1.user_id2 = f2.user_id1)) AS friends ON u.id = friends.friend WHERE friends.user = ?", [requestedUser],
function(err, results) {
	if (err) {
		throw err;
	} else {
		console.log("results from friend get request:", results);
		response.send(results);
			}
		})
})

router.get('/getUsernames', function(request, response){
	db.query('SELECT username FROM Users', function(err, results) {
		if (err) {
			throw err;
		} else {
		

			response.send(results);
		}
	})	
})

router.post('/add', function(request, response) {
	var user1 = request.body.id;
	var user2 = request.body.username2;

	db.query('SELECT id FROM Users WHERE `username` = ?', [user2], function(err, results) {
		if (err) {
			throw err;

		} else {

			if (results.length > 0) {
				var makeFriend = {
					user_id1: user1,
					user_id2: results[0].id,
					status: 0
				};
				var makeFriend2 = {
					user_id1: results[0].id,
					user_id2: user1,
					status: 0
				};
				db.query('INSERT INTO Friends SET ?', makeFriend, function(err, results2) {
					if (err) {
						throw err;
					} else {
						db.query('INSERT INTO Friends SET ?', makeFriend2, function(err, results3){


						response.send("Omg the insert works");


						})
					}
				})

			} else {
				response.send("second query does not work");
			}
		}
	})
})
module.exports = router;