var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db.js');
var cors = require('cors');

var app = express();
app.use(cors());


router.post('/', function(request, response) {
var requestedUser = request.body.id;
console.log(requestedUser);
db.query('SELECT user_id1,user_id2 FROM Friends WHERE (`user_id1` = ? OR `user_id2` = ?)', [requestedUser, requestedUser],
function(err, results) {
	if (err) {
		throw err;
	} else {
		console.log("results from friend get request:", results);
		var friendsList = [];
		for (var i = 0; i < results.length; i++){
			if (results[i].user_id1 === requestedUser) {
				friendsList.push(results[i].user_id2)
			} else {
				friendsList.push(results[i].user_id1)

			}
		}
		console.log(friendsList);
		db.query('SELECT username FROM Users', function(err, results2) {
			if (err) {
				throw err;
			} else {
				console.log("friends list from db", results2);



				response.send(results);
			}
		})

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