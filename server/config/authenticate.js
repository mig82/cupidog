var passport = require('passport')

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

var APP_DOMAIN = "http://ec2-52-28-118-238.eu-central-1.compute.amazonaws.com:3000"; //https://www.cupidog.es

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1632816823668819';
var FACEBOOK_APP_SECRET = '36f1bba41f9fd569714519333c1a3870';
//var FACEBOOK_API_VERSION = 'v2.4';

passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: APP_DOMAIN + "/auth/facebook/callback",
		passReqToCallback: true
	},
	function(accessToken, refreshToken, profile, done) {
		Users.findOrCreate(profile).then(function(error, user) {
			if (error) { return done(error); }
			done(null, user);
		});
	}
));

exports.passport = passport;