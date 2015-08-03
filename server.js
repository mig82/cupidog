"use strict";

var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./server/config/authenticate').passport;

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
/*app.use(session({
	secret: 'cupidog',
	saveUninitialized: true,
	resave: true
}));*/
app.use(passport.initialize());
app.use(passport.session());

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/

var ds = require('./server/datastore/datastore');
var Pets = ds.Pets;
var Breeds = ds.Breeds;
var Species = ds.Species;
var Users = ds.Users;


// curl -v http://127.0.0.1:3000/?access_token=123456789
// Authenticate using HTTP Bearer credentials, with session support disabled.
// passport.authenticate('bearer', { session: false }),

/**
	EndPoint: cupidog.com/api/pets?user=123
	String user: the Id for the user whose pets are requested.
*/
app.get("/api/pets",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		var userId = req.query.user;
		console.log("GET req for user %o", userId);

		Pets.findPetsByUser(userId).then(function(pets){
			res.json(pets);
		});
	}
);

app.post("/api/pets",
	passport.authenticate('bearer', { session: false }),
	function(req, res){		
		var newPet = req.body;
		console.log("POST req for pet %o", newPet);

		Pets.createPetForUser(newPet).then(function(pet){
			res.json(pet);
		});
	}
);

app.put("/api/pets/:id",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		var _pet = req.body;
		_pet._id = req.params.id;
		console.log("PUT req for pet %o", _pet);

		Pets.updatePet(_pet).then(function(pet){
			console.log("Updated %o", pet);
			res.json(pet);
		});
	}
);

app.get("/api/breeds",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		var species = req.query.sp;
		console.log("GET req %o", species);
		Breeds.findBreedsBySpecies(species).then(function(breeds){
			console.log("breeds found: ", breeds)	
			res.json(breeds);

		});
	}
);

app.get("/api/species",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		console.log("GET req for species");
		Species.findSpecies().then(function(species){
			console.log("species found: ", species)	
			res.json(species);
		});
	}
);

/*Matches mydomain.com/api/users/myemail@somemail.com?password=123*/
app.get('/api/users/:email', function(req, res) {

		var email = req.params.email;
		var psswd = req.query.password;
		console.log("GET req for user with user:password %o:%o", email, psswd);

		Users.authenticate( email, psswd ).then(function(user){
			if(user){
				console.log("Authentication successful for " + email + ":" + psswd);
			}
			else{
				console.log("Authentication failed for " + email + ":" + psswd);
			}
			res.json(user);
		});

});

/*Matches mydomain.com/api/users?access_token=123*/
app.get('/api/users',
	passport.authenticate('bearer', { session: false }),
	function(req, res) {

		var token = req.query.access_token;
		console.log("GET req for user with access_token:", token);

		Users.findByToken(token).then(function(user){
			if(user){
				console.log("Token auth successful for user: %o", user);
			}
			else{
				console.warn("Token auth failed for user: %o", user);
			}
			res.json(user);
		});
	}
);

app.get('/auth/facebook', function(req, res, next){
	
	console.log("1) Calling FB Authentication");

	passport.authenticate('facebook', {
		session: false,
		scope: [
			'public_profile',
			'email',
			'publish_actions',
			'user_friends'
		]
	})(req, res, next);
});

app.get('/auth/facebook/callback', function(req, res, next){
	
	var token = req.user?req.user.access_token:'';
	console.log("2) Calling FB Callback with access_token %o", token);

	passport.authenticate(
		'facebook', {
			session: false,
			failureRedirect: '#/login'
		},
		function(error, user){
			console.log("5) Passed verification callback with user:%o", user);
			if(token == ''){
				token = user?user.access_token:'';
				console.log("6) No req.user or no req.user.access_token found, overwritting with user.access_token %o", token);
			}
			//res.json(user);
			res.redirect('/#/main?access_token=' + token);
		}
	)(req, res, next);
});

app.listen(3000)
console.log("Cupidog server running on port 3000");