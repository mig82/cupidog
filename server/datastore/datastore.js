"use strict";

var mongojs = require('mongojs');

var Q = require('q');
Q.longStackSupport = true;

var db = mongojs('cupidog', ['users', 'pets', 'species', 'breeds', 'posts']);

exports.Pets = {

	findPetsByUser: function(userId){
		var deferred = Q.defer();

		db.pets.find( {_user: mongojs.ObjectId(userId) }, function(error, pets){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(pets);
			}
		});
		return deferred.promise;
	},

	createPetForUser: function(newPet){
		var deferred = Q.defer();
		newPet._user = mongojs.ObjectId(newPet._user);
		newPet.created = new Date();
		newPet.lastUpdate = newPet.created;

		db.pets.insert(newPet, function(error, pet){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(pet);
			}
		});
		return deferred.promise;
	},

	updatePet: function(updPet){
		var deferred = Q.defer();
		var lastUpdate = new Date();

		db.pets.findAndModify({
			query: {_id: mongojs.ObjectId(updPet._id) },
			update: {$set: {
				name: updPet.name,
				sp: updPet.sp,
				spIco: updPet.spIco,
				breed: updPet.breed,
				gender: updPet.gender,
				loc: updPet.loc,
				birthDate: updPet.birthDate,
				birthYear: updPet.birthYear,
				likes: updPet.likes,
				packs: updPet.packs,
				awards: updPet.awards,
				desc: updPet.desc,
				lastUpdate: lastUpdate,
				status: updPet.status,
			}},
			new: true
		}, function(error, pet){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(pet);
			}
		});
		return deferred.promise;
	}
};

exports.Breeds = {
	findBreedsBySpecies: function(species){
		var deferred = Q.defer();
		
		db.breeds.find({sp:species}, {_id:0, desc:1}, function(error, breeds){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(breeds);
			}
		});
		return deferred.promise;
	}
};

exports.Species = {
	findSpecies: function(){
		var deferred = Q.defer();

		db.species.find({}, {_id:0, desc:1},function(error, species){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(species);
			}
		});
		return deferred.promise;
	}
};

exports.Users = {
	authenticate: function(_email, _password){
		var deferred = Q.defer();

		db.users.findOne({ email: _email, password: _password }, function(error, user){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(user);
			}
		});
		return deferred.promise;
	},

	findById: function(userId){
		return this.findOne({ _id: userId });
	},

	findByToken: function(token){
		return this.findOne({access_token: token});
	},

	findOne: function(query){
		var deferred = Q.defer();

		db.users.findOne(query, function(error, user){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(user);
			}
		});
		return deferred.promise;
	},

	findOrCreate: function(newUser){ //With promises
		var deferred = Q.defer();
		var query = {
			provider: newUser.provider,
			provider_id: newUser.provider_id
		};
		var lastLogIn = new Date();

		db.users.findAndModify({
			query: query,
			update: {$set: {
				lastLogIn: lastLogIn,
				provider: newUser.provider,
				provider_id: newUser.provider_id,
				name: newUser.name,
				givenName: newUser.givenName,
				familyName: newUser.familyName,
				displayName: newUser.displayName,
				email: newUser.email,
				username: newUser.username,
				access_token: newUser.access_token
			}},
			new: true,
			upsert: true
		}, function(error, doc, lastErrorObject){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(doc);
			}
		});
		return deferred.promise;
	},

	_findOrCreate: function(newUser, done){ //With callback
		
		var query = {
			provider: newUser.provider,
			provider_id: newUser.provider_id
		};
		var lastLogIn = new Date();

		db.users.findAndModify({
			query: query,
			update: {$set: {
				lastLogIn: lastLogIn,
				provider: newUser.provider,
				provider_id: newUser.provider_id,
				name: newUser.name,
				givenName: newUser.givenName,
				familyName: newUser.familyName,
				displayName: newUser.displayName,
				email: newUser.email,
				username: newUser.username,
				access_token: newUser.access_token
			}},
			new: true,
			upsert: true
		}, function(error, user, lastErrorObject){
			if (error) { return done(error); }
			else {
                return done(null, user);
            }
		});
	},
};

exports.Posts = {
	findPosts: function(petId){
		var deferred = Q.defer();
		
		var query = {};
		if(petId){
			query._petAuthor = mongojs.ObjectId(petId);
		}

		db.posts.find(query).sort({created: -1}, function(error, posts){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(posts);
			}
		});
		return deferred.promise;
	},

	createPost: function(newPost){
		var deferred = Q.defer();
		newPost._petAuthor = mongojs.ObjectId(newPost._petAuthor);
		newPost._userAuthor = mongojs.ObjectId(newPost._userAuthor);
		newPost.created = new Date();
		newPost.lastUpdate = newPost.created;

		db.posts.insert(newPost, function(error, post){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(post);
			}
		});
		return deferred.promise;
	},
};