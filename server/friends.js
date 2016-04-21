var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db.js');
var cors = require('cors');

var app = express();
app.use(cors());

  //db.query('SELECT Users.username, Events.eventname, Events.timestamp, UserEvents.id, UserEvents.created_by
  // FROM Users INNER JOIN UserEvents ON 
  	//Users.id = UserEvents.user_id INNER JOIN Events ON Events.id = UserEvents.event_id ORDER BY event_id', function(err, rows){
//

// 'SELECT User.username FROM Users INNER JOIN Friends ON (`user_id1` = ? OR `user_id2` = ?)'
router.post('/', function(request, response) {
var requestedUser = request.body.id;
db.query('SELECT u.username FROM Users u INNER JOIN Friends f1 ON f1.user_id1=u.id INNER JOIN Friends f2 ON f2.user_id1 = f1.user_id2 AND f2.user_id2 = f1.user_id1 WHERE f2.user_id1 = ?', [requestedUser],
function(err, results) {
	if (err) {
		throw err;
	} else {
		console.log("results from friend get request:", results);
		response.send(results);
			}
		})
})



router.post('/add', function(request, response) {
	var user1 = request.body.username1;
	var user2 = request.body.username2;
	console.log("RECEIVING /friends/add POST REQUEST", user1, user2);
	db.query('SELECT id FROM Users WHERE `username` = ? OR `username` = ?;', [user1, user2], function(err, results) {
		if (err) {
			throw err;

		} else {
			console.log(results);
			if (results.length > 0) {
				console.log("adding a friend", results[0].id, results[1].id);
				var makeFriend = {
					user_id1: results[0].id,
					user_id2: results[1].id,
					status: 0
				};
				db.query('INSERT INTO Friends SET ?', makeFriend, function(err, resultss) {
					if (err) {
						throw err;
					} else {
						console.log("Results upon successful insertion:", resultss);
						response.send("Omg the insert works");
					}
				})

			} else {
				response.send("second query does not work");
			}
		}
	})
})
module.exports = router;