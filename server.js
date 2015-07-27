"use strict";

var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));

var bp = require('body-parser');
app.use(bp.json());

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/


var passport = require('./server/config/authenticate').passport;

var ds = require('./server/datastore/datastore');
var Pets = ds.Pets;
var Breeds = ds.Breeds;
var Species = ds.Species;
var Users = ds.Users;

/**
	EndPoint: cupidog.com/api/pets?user=123
	String user: the Id for the user whose pets are requested.
*/
app.get("/api/pets", function(req, res){
	var userId = req.query.user;
	console.log("I received a pets get request for user %o", userId);

	Pets.findPetsByUser(userId).then(function(pets){
		res.json(pets);
	});

});

app.post("/api/pets", function(req, res){
	
	var newPet = req.body;
	console.log("POST req for pet %o", newPet);

	Pets.createPetForUser(newPet).then(function(pet){
		res.json(pet);
	});
});

app.put("/api/pets/:id", function(req, res){
	
	var _pet = req.body;
	_pet._id = req.params.id;
	console.log("PUT req for pet %o", _pet);

	Pets.updatePet(_pet).then(function(pet){
		console.log("Updated %o", pet);
		res.json(pet);
	});

});

app.get("/api/breeds", function(req, res){
	
	var species = req.query.sp;
	console.log("GET req %o", species);
	Breeds.findBreedsBySpecies(species).then(function(breeds){
		console.log("breeds found: ", breeds)	
		res.json(breeds);

	});
});

app.get("/api/species", function(req, res){
	console.log("received a get request for species");
	Species.findSpecies().then(function(species){
		console.log("species found: ", species)	
		res.json(species);
	});
});


//EndPoint: cupidog.com/api/users/myemail@somemail.com?password=123
app.get('/api/users/:email',
	//passport.authenticate('basic', { session: false }),
	function(req, res) {

		var email = req.params.email;
		var psswd = req.query.password;

		Users.authenticate( email, psswd ).then(function(user){
			if(user){
				console.log("Authentication successful for " + email + ":" + psswd);
			}
			else{
				console.log("Authentication failed for " + email + ":" + psswd);
			}
			res.json(user);
			//res.redirect('/users/' + req.user.username);
		});
});


app.get('/auth/facebook',
	passport.authenticate('facebook',
	{ scope: ['public_profile', 'email'] }
));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/main/home',
		failureRedirect: '/login'
	})
);


app.listen(3000)
console.log("Cupidog server running on port 3000");