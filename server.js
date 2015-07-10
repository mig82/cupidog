"use strict";
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));

var mongojs = require('mongojs');
var db = mongojs('cupidog', ['users', 'pets', 'species', 'breeds']);

var bp = require('body-parser');
app.use(bp.json());

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/

app.get("/pets", function(req, res){
	console.log("I received a pets get request");

	/*var user = {
		_id: 1,
		_pets: [1, 2, 3],
		contactInfo: {
			email: "miguelangelxfm@gmail.com",
			mobile: "(+34)777.77.77.66",
			phone: "(+34)915.77.77.66",
		}
	};

	db.users.insert(user);
	db.pets.insert([p1,p2,p3]);*/

	db.users.findOne( {_id:1}, function(err, user){
			
			db.pets.find(function(err, pets){
				user.pets = pets;
				//console.log("This is what I've found %o", user);
				res.json(user);
			});
	});

	//res.json(user);
});

app.post("/pets", function(req, res){
	console.log("POST req %o", req.body);
	db.pets.insert(req.body, function(err, pet){
		res.json(pet);
	});
});

app.get("/breeds", function(req, res){
	console.log("GET req %o", req.query.sp);
	db.breeds.find({sp:req.query.sp}, {_id:0, desc:1},function(err, breeds){
		console.log("breeds found: ", breeds)	
		res.json(breeds);

	});
});

app.get("/species", function(req, res){
	console.log("received a get request for species");
	db.species.find({}, {_id:0, desc:1},function(err, species){
		console.log("species found: ", species)	
		res.json(species);

	});
});

app.listen(3000)
console.log("Cupidog server running on port 3000");