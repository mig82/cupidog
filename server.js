"use strict";

var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));

var mongojs = require('mongojs');
var db = mongojs('cupidog', ['users', 'pets', 'species', 'breeds']);
global.Users = db.users;

var bp = require('body-parser');
app.use(bp.json());

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/


var passport = require('./authenticate').passport;

app.get("/api/pets", function(req, res){
	var userId = req.query.user;
	console.log("I received a pets get request for user %o", userId);

	db.pets.find( {_user: mongojs.ObjectId(userId) }, function(err, pets){
		res.json(pets);
	});
});

app.post("/api/pets", function(req, res){
	
	var _pet = req.body;
	console.log("POST req for pet %o", _pet);
	_pet._user = mongojs.ObjectId(_pet._user);

	db.pets.insert(req.body, function(err, pet){
		res.json(pet);
	});
});

app.put("/api/pets/:id/likes", function(req, res){
	
	var likes = req.body;
	console.log("PUT req for likes %o", req.params.id);
	
	db.pets.findAndModify({
		query: {_id: mongojs.ObjectId(req.params.id)},
		update: {$set: { likes: likes }},
		new: true
	}, function(err, doc){
		console.log("updated %o", doc);
		res.json(doc);
	});
});

app.put("/api/pets/:id", function(req, res){
	
	var _pet = req.body;
	console.log("PUT req for pet %o", _pet);

	db.pets.findAndModify({
		query: {_id: mongojs.ObjectId(req.params.id) },
		update: {$set: {
			name: _pet.name,
			sp: _pet.sp,
			breed: _pet.breed,
			gender: _pet.gender,
			loc: _pet.loc,
			birthDate: _pet.birthDate,
			birthYear: _pet.birthYear,
			likes: _pet.likes,
			packs: _pet.packs,
			awards: _pet.awards,
			desc: _pet.desc
		}},
		new: true
	}, function(err, doc){
		console.log("updated %o", doc);
		res.json(doc);
	});
});

app.get("/api/breeds", function(req, res){
	console.log("GET req %o", req.query.sp);
	db.breeds.find({sp:req.query.sp}, {_id:0, desc:1},function(err, breeds){
		console.log("breeds found: ", breeds)	
		res.json(breeds);

	});
});

app.get("/api/species", function(req, res){
	console.log("received a get request for species");
	db.species.find({}, {_id:0, desc:1},function(err, species){
		console.log("species found: ", species)	
		res.json(species);

	});
});


//Handles www.mydomain.com/api/users/myemail@somemail.com?password=123
app.get('/api/users/:email',
	//passport.authenticate('basic', { session: false }),
	function(req, res) {
		db.users.findOne({ email: req.params.email, password: req.query.password }, function(err, user){
			if(user){
				console.log("Authentication successful for " + req.params.email + ":" + req.query.password);
			}
			else{
				console.log("Authentication failed for " + req.params.email + ":" + req.query.password);
			}
			res.json(user);
			//res.redirect('/users/' + req.user.username);
		});
});


app.listen(3000)
console.log("Cupidog server running on port 3000");