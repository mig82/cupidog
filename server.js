"use strict";

var express = require('express');
var app = express();

var nconf = require('nconf');

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
var Posts = ds.Posts;
var Photos = ds.Photos;


// curl -v http://127.0.0.1:3000/?access_token=123456789
// Authenticate using HTTP Bearer credentials, with session support disabled.
// passport.authenticate('bearer', { session: false }),


/*********************/
/******* Pets ********/
/*********************/

/**	Find all pets for a specific user.
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

/*********************/
/******* breeds ******/
/*********************/

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

/*********************/
/******* species *******/
/*********************/

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

/*********************/
/******* users *******/
/*********************/

/*	Find by a user by user/email and password
*	Matches mydomain.com/api/users/myemail@somemail.com?password=123
*/
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
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.json(user);
		});

});

/*	Find a user by third party bearer authentication token.
	Matches mydomain.com/api/users?access_token=123
*/
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

/*********************/
/******* posts *******/
/*********************/

app.get("/api/posts",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		console.log("GET req for posts");
		
		Posts.findPosts().then(function(posts){
			console.log("posts found: ", posts)	
			res.json(posts);
		});
	}
);

app.get("/api/pets/:id/posts",
	passport.authenticate('bearer', { session: false }),
	function(req, res){

		var petId = req.params.id;
		console.log("GET req for posts of pet %o", petId);
		
		Posts.findPosts(petId).then(function(posts){
			console.log("posts found: ", posts)	
			res.json(posts);
		});
	}
);

app.post("/api/pets/:id/posts",
	passport.authenticate('bearer', { session: false }),
	function(req, res){
		console.log("POST req for posts");

		var newPost = req.body;
		newPost._petAuthor = req.params.id;

		console.log("POST req for pet %o", newPost);

		Posts.createPost(newPost).then(function(post){
			res.json(post);
		});
	}
);

/*********************/
/*** photo uploads ***/
/*********************/

var multiparty = require('multiparty');
var AWS = require('aws-sdk');
var bucket = nconf.get('S3_BUCKET');
var s3 = new AWS.S3({
  accessKeyId: nconf.get('S3_KEY'),
  secretAccessKey: nconf.get('S3_SECRET'),
  region: nconf.get('S3_REGION'),
  // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
});

app.post('/api/pets/:id/photos',
	function(req, res) {

		var form = new multiparty.Form();
		var photo = {};
		
		form.on('field', function(name, value) {
			console.log("Received field %s=%s", name, value);
			photo[name] = value;
		});

		form.on('part', function(part) {

			console.log("Received a part %o", part);
			if (part.filename) {
				console.log("    The part is a file with name %s", part.filename);
				var destPath = 'gallery/' + req.params.id + '/' + part.filename;
				photo.name = part.filename;
				photo.path = destPath;

				var opts = {
					Bucket: bucket,
					Key: destPath,
					ACL: 'public-read',
					Body: part,
					ContentLength: part.byteCount,
				};

				s3.putObject(opts, function(err, data) {
					
					if (err) throw err;
					
					console.log("Part upload completed!", data);
					res.writeHead(200, {'content-type': 'text/plain'});
					res.end('Ok');
				});
			}
	
		});

		// Close emitted after form parsed
		form.on('close', function() {
			console.log("Form closed with photo: %o", photo);
			
			Photos.createPhoto(photo).then(function(photo){
				console.log("Created photo: %o", photo);
			});
		});

		form.parse(req);
	}
);

app.get("/api/pets/:id/photos",
	passport.authenticate('bearer', { session: false }),
	function(req, res){

		var petId = req.params.id;
		console.log("GET req for photos of pet %o", petId);
		
		Photos.findPhotos(petId).then(function(photos){
			console.log("photos found: ", photos)	
			res.json(photos);
		});
	}
);
	

/*app.post('/api/pets/:id/photos',
	function(req, res) {

		var form = new multiparty.Form();
		var petId = req.params.id;

		form.parse(req, function(err, fields, files) {

			console.log("Fields %o", fields);
			console.log("Files %o", files);

			res.writeHead(200, {'content-type': 'text/plain'});
			res.write('received upload');
		});
	}
);*/

/*********************/
/******* login *******/
/*********************/

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

var webAppUrl = nconf.get('WEBAPP_URL');
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
			res.redirect( webAppUrl + '/#/main?access_token=' + token);
		}
	)(req, res, next);
});


/*********************/
/******* start *******/
/*********************/
var nodePort = nconf.get('NODE_PORT');
app.listen(nodePort);
console.log("Cupidog server running on port:%s", nodePort);
console.log("	Started at " + new Date() );

/*app.post('/api/pets/:id/photos',
	function(req, res) {

		var count = 0;
		var form = new multiparty.Form();
		var petId = req.params.id;

		var photo = {
			_petAuthor: petId,
			files: []
		};

		form.on('field', function(name, value) {
			console.log("Field %s = %s", name, value);
			if(name === 'userId'){
				photo._userAuthor = value;
			}
		});

		form.on('part', function(part) {
			
			if (part.filename) {
				count++;
				// filename is defined when this is a file
				console.log('File: %o', part);
				// ignore file's content here

				photo.files.push(part);

				part.resume();
			}
			else{
				// filename is not defined when this is a field and not a file
				console.log('Field: %s', part.name);
				// ignore field's content
				part.resume();
			}

			part.on('error', function(err) {
				console.error("Error: %o", err);
				// TODO: decide what to do
			});
		});

		// Close emitted after form parsed
		form.on('close', function() {

			Photos.createPhoto(photo).then(function(photo){
				//
			});

			console.log('Upload completed!');
			res.writeHead(200, {'content-type': 'text/plain'});
			res.end('Received ' + count + ' files');
		});

		form.parse(req);

		/*form.parse(req, function(err, fields, files) {

			console.log("Fields %o", fields);
			console.log("Files %o", files);
			
			var photo = {
				_petAuthor: petId,
				_userAuthor: fields.userId,
				/*file: files[0],*
			}

			Photos.createPhoto(photo).then(function(photo){
				res.writeHead(200, {'content-type': 'text/plain'});
				res.write('received upload');
				//res.end(util.inspect({fields: fields, files: files}));
			});
		});*
	}
);*/