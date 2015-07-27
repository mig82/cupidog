"use strict";

var mongojs = require('mongojs');
var Q = require('q');
var db = mongojs('cupidog', ['users', 'pets', 'species', 'breeds']);

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

		db.pets.findAndModify({
			query: {_id: mongojs.ObjectId(updPet._id) },
			update: {$set: {
				name: updPet.name,
				sp: updPet.sp,
				breed: updPet.breed,
				gender: updPet.gender,
				loc: updPet.loc,
				birthDate: updPet.birthDate,
				birthYear: updPet.birthYear,
				likes: updPet.likes,
				packs: updPet.packs,
				awards: updPet.awards,
				desc: updPet.desc
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

	findOrCreate: function(profile){
		var deferred = Q.defer();

		db.users.findOne({ _id: profile.id }, function(error, user){
			if (error) {
				deferred.reject(new Error(error));
			}
			else {
				deferred.resolve(user);
			}
		});
		return deferred.promise;
	},
};