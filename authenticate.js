var passport = require('passport')
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

var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1632816823668819';
var FACEBOOK_APP_SECRET = '36f1bba41f9fd569714519333c1a3870';
//var FACEBOOK_API_VERSION = 'v2.4';

passport.use(new FacebookStrategy({
	  clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://www.example.com/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate(..., function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

exports.passport = passport;