/*
Assignment 4 - Oscar Castelblanco
Based on code provided by prof. Lou Nel
*/

var url = require('url');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/recipes.db');

db.serialize(function(){
	  //Create a user in the database
	  //user: oscar password: 2406
      var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
      db.run(sqlString);
      sqlString = "INSERT OR REPLACE INTO users VALUES ('oscar', '2406')";
      db.run(sqlString);
  });

exports.authenticate = function (request, response, next){
    /*
	Middleware to do BASIC http 401 authentication
	*/
  var auth = request.headers.authorization;
	if(!auth){
		response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
        response.writeHead(401, {'Content-Type': 'text/html'});
		console.log('No authorization found, send 401.');
 		response.end();
	}
	else{
	    console.log("Authorization Header: " + auth);
        //decode authorization header
        var tmp = auth.split(' ');

		     // create a buffer and tell it the data coming in is base64
        var buf = new Buffer(tmp[1], 'base64');

        // read it back out as a string
		    var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':');      // split on a ':'
        var username = credentials[0];
        var password = credentials[1];
        console.log("User: ", username);
        console.log("Password: ", password);

		var authorized = false;
		//check database users table for user
		db.all("SELECT userid, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
		      if(rows[i].userid == username & rows[i].password == password) authorized = true;
		}
		if(authorized == false){
 	 	   //we had an authorization header by the user:password is not valid
		   response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
           response.writeHead(401, {'Content-Type': 'text/html'});
		   console.log('No authorization found, send 401.');
 		   response.end();
		}
        else
		  next();
		});
	}

}
function addHeader(request, response){
        // about.html
        var title = 'Recipes:';
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<!DOCTYPE html>');
        response.write('<html><head><title>About</title></head>' + '<body>');
        response.write('<h1>' +  title + '</h1>');
		response.write('<hr>');
}

function addFooter(request, response){
 		response.write('<hr>');
		response.write('<h3>' +  'Carleton University' + '</h3>');
		response.write('<h3>' +  'School of Computer Science' + '</h3>');
        response.write('</body></html>');

}


/* Route of index.html
  Render the index.hbs with the parameters*/
exports.index = function (request, response){
	     response.render('index', { title: 'Recipes', body: 'Insert the ingredient or ingredients separated with commas and click submit'});
}

/** Function to parse url **/
function parseURL(request, response){
	var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery , slashHost );
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj;

}
/** Route of users.html
    renders the web page with all current users
  */
exports.users = function(request, response){
    // query all the users in the database and send to the user
		db.all("SELECT userid, password FROM users", function(err, rows){
 	       response.render('users', {title : 'Users:', userEntries: rows});
		})

}

/** Route of find/
    Looks up for a recipe depending if the searched item is ingredient or spice
    and renders into the web page the results
  */
exports.find = function (request, response){
        // find.html
		console.log("RUNNING FIND RECIPES");

		var urlObj = parseURL(request, response);
		var sql = "SELECT id, recipe_name FROM recipes";
      /** If URL query is for ingredients */
      if(urlObj.query['ingredients']) {
		    console.log("finding recipe with this ingredients: " + urlObj.query['ingredients']);
        /* Split if there are many ingredients */
        var ingredients = urlObj.query['ingredients'].split(",");
        console.log(ingredients.length);
        sql = "";
        /** Loop over all the ingredients and get the intersected results for the query
        of the individual items**/
        for(let i = 0; i<ingredients.length; i++){
  		    sql = sql + "SELECT id, recipe_name FROM recipes WHERE ingredients LIKE '%" +
  			          ingredients[i] + "%'";
          if(ingredients.length > 1 && i < ingredients.length-1){
            sql = sql +  " intersect ";
          }
        }/** If URL query is for spices */
      } else if(urlObj.query['spices']){
        console.log("finding recipe with this spices: " + urlObj.query['spices']);
        var spices = urlObj.query['spices'].split(",");
        console.log(spices.length);
        sql = "";
        for(let i = 0; i<spices.length; i++){
  		    sql = sql + "SELECT id, recipe_name FROM recipes WHERE spices LIKE '%" +
  			          spices[i] + "%'";
          if(spices.length > 1 && i < spices.length-1){
            sql = sql +  " intersect ";
          }
        }
      }
    console.log(sql);
    /** Render the answer of the query */
		db.all(sql, function(err, rows){
	       response.render('recipesView', {title: 'Recipes:', recipeEntries: rows, body: 'Insert the name of the ingredients separated by comma'});
 		});
}

/** Route of /recipes/*
    Looks up for a recipe depending on its id
    and renders into the web page the results
  */
exports.recipesDetails = function(request, response){

	    var urlObj = parseURL(request, response);
        var recipeID = urlObj.path; //expected form: /recipes/235
		recipeID = recipeID.substring(recipeID.lastIndexOf("/")+1, recipeID.length);
    /**Query all atributes of the recipe **/
		var sql = "SELECT id, recipe_name, spices, contributor, category, description, source, rating, ingredients, directions FROM recipes WHERE id=" + recipeID;
        console.log("GET RECIPES DETAILS: " + recipeID );
      /*Render the web page with the results*/
		db.all(sql, function(err, rows){
		  let recipe = rows[0];

		  console.log('Recipe Details');
		  console.log(recipe);
 	      response.render('recipesDetails', {title: 'Recipe Details:', recipe: recipe});
		});

}
