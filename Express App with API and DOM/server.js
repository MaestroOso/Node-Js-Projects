/*
Code based on Prof. Lou Nel Tutorials and Sample Code
Assignment done by Oscar Castelblanco
To test:
http://localhost:3000
or
http://localhost:3000/recipes
or
http://localhost:3000/start?ingredients="Ingredient"
*/
const express = require('express') //express framework
const requestModule = require('request') //npm module for easy http requests
const PORT = process.env.PORT || 3000
var sqlite3 = require('sqlite3').verbose(); //npm install sqlite3

/* Database */
var db = new sqlite3.Database('recipes');

const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Route for localhost:3000/recipes
app.get('/recipes', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})
//Route for localhost:3000
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})
/** Act when a get method with start is called**/
app.get('/start', (request, response) => {
  let ingredients = request.query.ingredients
  console.log(ingredients);
  if(!ingredients) {
    return response.json({message: 'Please enter a ingredients name'})
  }
  const url = `http://www.food2fork.com/api/search?q=${ingredients}&key=${FOOD_API_KEY}`;
  requestModule.get(url, (err, res, data) => {
    //console.log('url: ', url);
    if (err) { return console.log(err); }
    //Send JSON object as a response
    return response.contentType('application/json').json(JSON.parse(data))
  })
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
  }
})
