const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const beerHub = require('../models');
const beerPath = path.join(__dirname, '../data/beers.json');

//GET ALL, return json data
router.get('/', (req, res, next) => {
  beerHub.all((err, beers) => {
  	// let beerzList = JSON.stringify(beers, null, 2);  
  	beerzList = JSON.parse(beers);
  	// console.log(beerList);
    res.json({ beerzList });
  });
});


//GET SINGLE beer id obj
router.get('/single/:id', (req, res, next) => {
	//call model, get beerlist, parse the integer of the requested id
  beerHub.get(parseInt(req.params.id), (err, beer) => {
  	singleBeer = JSON.parse(beer);
    res.json(singleBeer);
  });
});


//POST to create new beer obj
router.post('/add', (req, res, next) => {
	//set headers. sanity checks, not needed
	res.setHeader('Content-Type', 'application/json');

	//check incoming object data
	console.log(req.body);

	//only accept desired fields - (minor sanitzation of json)
	const beer = {
  	name: req.body.name,
  	ibu: req.body.ibu,
  	abv: req.body.abv,
  	flavors: req.body.flavors,
	  lastTappedOn: req.body.lastTappedOn,
	  breweryId: req.body.breweryId,
	  breweryName: req.body.breweryName
	};

	//run the all function to get access to the full dataset
  beerHub.all((err, beers) => {

  	//parse JSON data
  	const parsedBeers = JSON.parse(beers).value;

  	//find total length of beer objects and set ID 
  	beer.id = parsedBeers[parsedBeers.length - 1].id + 1;

  	//run create function using our minorly sanitized new beer object 
		beerHub.create(beer, (err, message) => {
			//error handling
			if (err) {
				res.send({ error: err });
			} else {
				//hooray beer! 
				console.log('The world has gained a beer, and this is truly a day of rejoicing...')
				res.send({ success: 'successfully added' });
			}
		});
  });

});


//EDIT a beer object
router.post('/edit', (req, res, next) => {
	//verify id param
	console.log(req.body.id);

	//use edit model 
	beerHub.edit(parseInt(req.body.id), req.body.beerData, (err, message) => {

		//veryify correct id + json obj data
		console.log(parseInt(req.body.id));
		console.log(req.body.beerData);

		//error handling
		if (err) {
			res.send({ error: err });
		} else { 
			//edited!
			console.log('successfully edited');
		}
	});
});


//DELETE a beer object
router.post('/delete', (req, res, next) => {
	//verify
	console.log(req.body.id);
	//use delete model 
	beerHub.delete(parseInt(req.body.id), (err, message) => {
		//error handling
		if (err) {
			res.send({ error: err });
		} else { 
			//less beer :( 
			console.log('deleted... the world has less beer now...')
		}
	});
});

module.exports = router;