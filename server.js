"use strict";
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));

var mongojs = require('mongojs');
var db = mongojs('cupidog', ['users', 'pets']);

var bp = require('body-parser');
app.use(bp.json());

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/

app.get("/pets", function(req, res){
	console.log("I received a get request");

	/*var p1 = {
		_id: 1,
		user_id: 1,
		name: "Bruce",
		gender: "m",
		sp: "dog",
		race: "german shepperd",
		age: 4,
		weight: 43,
		pedigree: "LOE",
		parenthood: 0,
		desc: "Buen pelo y sin operaciones",
		tags: ["playful", "sociable"],
		profilePic: "img/profiles/bruce.png",
		location: "madrid"
	};

	var p2 = {
		_id: 2,
		user_id: 1,
		name: "Sombra",
		gender: "f",
		sp: "dog",
		race: "shar pei",
		age: 5,
		weight: 35,
		parenthood: 2,
		cubs: [3,2],
		desc: "Muy buen comportamiento y color de piel único. De tamaño pequeño",
		eyes: "blue",
		inHeat: true,
		profilePic: "img/profiles/sombra.png",
		location: "madrid"
	};

	var p3 = {
		_id: 3,
		user_id: 1,
		name: "Bola de Pelo",
		gender: "f",
		sp: "cat",
		race: "American Bobtail",
		age: 2,
		weight: 5,
		parenthood: 0,
		desc: "Muy juguetona y cariñosa",
		eyes: "green",
		inHeat: false,
		profilePic: "img/profiles/bolaPelo.jpg",
		location: "madrid"
	};

	var user = {
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
				console.log("This is what I've found %o", user);
				res.json(user);
			});
	});

	//res.json(user);
});

app.post("/pets", function(req, res){
	console.log("I received a post request with %o", req.body);
	db.pets.insert(req.body, function(err, pet){
		res.json(pet);
	});
});

app.listen(3000)
console.log("Cupidog server running on port 3000");