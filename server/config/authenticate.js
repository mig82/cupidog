var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var ds = require('../datastore/datastore');
var Users = ds.Users;

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
));*/

//-----OJO--------: Para AWS usar: http://ec2-52-28-118-238.eu-central-1.compute.amazonaws.com:3000
//var APP_DOMAIN = "http://test.ec2-52-28-118-238.eu-central-1.compute.amazonaws.com:3000"; //https://www.cupidog.es
var APP_DOMAIN = "http://localhost:3000"; //https://www.cupidog.es
var FACEBOOK_APP_ID = '1632816823668819';
var FACEBOOK_APP_SECRET = '36f1bba41f9fd569714519333c1a3870';
//var FACEBOOK_API_VERSION = 'v2.4';

passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: APP_DOMAIN + "/auth/facebook/callback"
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
});


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

exports.passport = passport;