const fs = require('fs');
const path = require('path');

// we're using a JSON file and this model system as a substitute for an actual db
const beerPath = path.join(__dirname, '../data/beers.json');


// create and write data to beers file
exports.create = function (beerObj, cb) {
  fs.readFile(beerPath, 'utf8', (err, data) => {
    if (err) throw err;
    const beers = JSON.parse(data);
    beers.value.push(beerObj);
    const jsonBeers = JSON.stringify(beers, null, 2);
    fs.writeFile(beerPath, jsonBeers, 'utf8', (error) => {
      if (error) throw error;
      cb(null, 'Successfully added object to JSON');
    });
  });
};

// get specific beer obj by id
exports.get = function (id, cb) {
  fs.readFile(beerPath, 'utf8', (err, data) => {
    if (err) throw err;
    const beer = findBeerObject(id, data);
    cb(null, beer);
  });
};

// delete specific beer obj by id
exports.delete = function (id, cb) {
  fs.readFile(beerPath, 'utf8', (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    parsedData.value = parsedData.value.filter(el => el.id !== id);
    const deletedBeer = findBeerObject(id, data);
    console.log('deletedBeer', deletedBeer);
    const jsonBeers = JSON.stringify(parsedData, null, 2);
    fs.writeFile(beerPath, jsonBeers, 'utf8', (error) => {
      if (error) throw error;
      cb(null, `Successfully deleted `);
    });
  });
};

// edit a specific beer object with provided data
exports.edit = function (id, beerData, cb) {
  fs.readFile(beerPath, 'utf8', (err, data) => {
    const parsedData = JSON.parse(data);
    let beerIndex = 0;
    parsedData.value.forEach((el, i) => {
      if (el.id === id) {
        beerIndex = i;
        parsedData.value[i] = {...el, ...beerData };
      }
    });
    const jsonBeers = JSON.stringify(parsedData, null, 2);
    fs.writeFile(beerPath, jsonBeers, 'utf8', (error) => {
      if (error) throw error;
      cb(null, `Successfully updated ${parsedData.value[beerIndex].name} with ${JSON.stringify(beerData)}`);
    });
  });
};

// filter beer list for a particular id
function findBeerObject(id, beerList) {
  const beers = JSON.parse(beerList).value;
  const singleBeer = beers.find(el => el.id === id);
  return JSON.stringify(singleBeer);
}

// gets all data from file
exports.all = function (cb) {
  fs.readFile(beerPath, null, (err, data) => {
    if (err) throw err;
    cb(null, data);
  });
};