var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var ds = require('../datastore/datastore');
var Users = ds.Users;

var fs = require('fs');
var nconf = require('nconf');

// Setup nconf to use (in-order):
//	 1. Command-line arguments
//	 2. Environment variables
//	 3. A file located at 'path/to/config.json'
nconf.argv()
	 .env();

var NODE_ENV = nconf.get('NODE_ENV');
console.log('    NODE_ENV: ' + NODE_ENV);

var configFilePath = './server/config/server_config';

if(NODE_ENV){
	configFilePath += '_' + NODE_ENV + '.json';
}
else{
	configFilePath += '.json';
	console.warn("WARN: NODE_ENV is not defined");
}

console.log("Will load config from '%s'", configFilePath);

try{
	nconf.file({ file: configFilePath });
	nconf.load(function(obj){
		console.log("    Success loading config file from '%s'", configFilePath);
		console.log("    WEBAPP_URL:", nconf.get('WEBAPP_URL'));
	});
}
catch(err){
	console.error("ERROR: Unable to load config from '%s': %o", configFilePath, err);
	console.error(err);
}

var fbConf = nconf.get('FB_AUTH_CONF');
console.log('    APP_DOMAIN:' + fbConf.APP_DOMAIN);

// Save the configuration object to disk
/*nconf.save(function (err) {
	fs.readFile( configFilePath , function (err, data) {
		//console.dir(JSON.parse(data.toString())) //TODO: returning undefined in AWS. Don't know why yet
	});
});*/

passport.use(
	new FacebookStrategy({
		clientID: 		fbConf.FACEBOOK_APP_ID,
		clientSecret: 	fbConf.FACEBOOK_APP_SECRET,
		callbackURL: 	fbConf.APP_DOMAIN + "/auth/facebook/callback",
		profileFields: ['id', 'emails', 'displayName']
	},
	function(accessToken, refreshToken, profile, done) {

		console.log("3) PassportJs called Facebook verify callback with profile %o and accessToken", profile, accessToken);

		// Set the provider data and include tokens
		/*var provProf = profile._json;
		provProf.accessToken = accessToken;
		provProf.refreshToken = refreshToken;*/

		var email = profile.emails?profile.emails[0].value:'';

		// Create the user FaceBook profile
		var _user = {
			provider: 'fb',
			provider_id: profile._json.id,
			name: profile._json.name,
			givenName: profile.name.givenName,
			familyName: profile.name.familyName,
			displayName: profile.displayName,
			email: email,
			username: profile.username,
			access_token: accessToken
		};

		//With promises
		Users.findOrCreate(_user).then(function(user) {
			console.log("4) Found or created new FB user from data store: %o", user);
			done(null, user);
		});

		//With callbacks
		/*Users.findOrCreate(_user, function(error, user) {
			console.log("4) Found or created new FB user from data store: %o", user);
			if (error) { return done(error); }
				done(null, user);
		});*/

	}
));

passport.use(	
	new BearerStrategy(
		function(token, done) {

			console.log("7) PassportJs called Bearer verify callback with token: %o", token);

			Users.findByToken(token).then(function(user) {
				if(!user) {
					done(null, false)
				}
				else{
					done(null, user, { scope: 'all' })
				}
			}).fail(function(error){
				done(error);
			});
		}
	)
);

/*var BasicStrategy = require('passport-http').BasicStrategy

passport.use(new BasicStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done) {
		Users.findOne({ email: username }, function (err, user) {
			//if (err) { return done(err); }
			//if (!user) { return done(null, false); }
			//if (!user.validPassword(password)) { return done(null, false); }
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	console.log("Serializing user %o", user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	
	Users.findById(id).then(function(user){
		console.log("Deserializing user %o", user);
		done(null,user);
	}).fail(function(error){
		done(error);
	});
});*/

exports.passport = passport;
