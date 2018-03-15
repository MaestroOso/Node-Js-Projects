/*
Assignment 4 - Oscar Castelblanco

Based on code provided by prof. Lou Nel

Testing: (user: oscar password: 2406)
http://localhost:3000/index.html
http://localhost:3000/users
http://localhost:3000/find?ingredients=cheese
http://localhost:3000/find?spices=salt
http://localhost:3000/recipes/16
*/

//Cntl+C to stop server

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var  app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index');

//some logger middleware functions
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}

//register middleware with dispatcher
//middleware
app.use(routes.authenticate); //authenticate user
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//routes
app.get('/index.html', routes.index);
app.get('/find', routes.find);
app.get('/users', routes.users);
app.get('/recipes/*', routes.recipesDetails);

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)}
})
