"use strict";
var express = require('express');
var app = express();

/*app.get('/', function(req, res){
	res.send("Hello world from CupiDog");
});*/

app.use(express.static(__dirname + "/public"));

app.get("/pets", function(req, res){
	console.log("I received a get request");

	var p1 = {
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
		pets: [p1, p2, p3],
		contactInfo: {
			email: "miguelangelxfm@gmail.com",
			mobile: "(+34)777.77.77.66",
			phone: "(+34)915.77.77.66",
		}
	};

	res.json(user);
});

app.listen(3000)
console.log("Cupidog server running on port 3000");