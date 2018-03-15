/*
To test:
Open two browsers at http://localhost:3000/canvas.html

//collaboration through polling

When the text field is filled with one of the codes for a player
a orange cube will appear on the cube that the player has access to.
This cube can be moved by using the arrow keys. A POST message will be
sent to the server when the arrow key is pressed and released.

Clients also request the information of the game by polling the server.
The smoothness is thus affected by the rate at which the polling timer
runs. The trade off is smooth behaviour vs. network traffic.

This code is based on the Sample Code given by Prof. Lou Nel.
*/

//Cntl+C to stop server

var http = require("http"); //need to http
var fs = require("fs"); //need to read static files
var url = require("url"); //to parse url strings
var coin = require("./coinCollector");

//server maintained location of moving box
var gameInformation = {
  Name: 'Server',
  Player1: {
    x: 50, y: 100, score: 0
  },
  Player2:{
    x:450, y:100, score: 0
  },
  Coin:{
    x:200 , y: 200, width: 10, height: 10
  }
}
//Server mantained information of Player Properties
var PlayerProperties = {
  width: 50, height: 50
}


var ROOT_DIR = "html"; //dir to serve static files from
//MIME types
var MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES["txt"];
};
//Function to create the server
http
  .createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    });

    //event handler for the end of the message
    request.on("end", function() {
      console.log("REQUEST END: ");
      console.log("received data: ", receivedData);

      //if it is a POST request then echo back the data.
      /*
		A post message will be interpreted as either a request for
		the information of the game, or the update on the information of the game
		being set by a client.
		If the name attribute is "Player1" or "Player2"
		treat it as setting the location of the moving box.
		If the name attribute is "Server" treat it as a request (poll)
		for the location of the moving box.
		In either case echo back the location of the moving box to whatever client
		sent the post request..
		*/
      if (request.method == "POST") {
        var dataObj = JSON.parse(receivedData);

        if(dataObj.Name == 'Player1'){
            console.log("Recieved Data from Player1");
            gameInformation.Player1.x = dataObj.Player1.x;
            gameInformation.Player1.y = dataObj.Player1.y;
        } else if(dataObj.Name == 'Player2'){
            console.log("Recieved Data from Player2");
            gameInformation.Player2.x = dataObj.Player2.x;
            gameInformation.Player2.y = dataObj.Player2.y;
        } else if(dataObj.Name == 'Server'){
          //Client asks for status of the game
          console.log("How is the game?");
        }

        //Evaluate if someone got the coin and re span it
        if(coin(gameInformation.Player1.x, gameInformation.Player1.y, PlayerProperties.width, PlayerProperties.height, gameInformation.Coin.x,gameInformation.Coin.y) == true){
          gameInformation.Player1.score = gameInformation.Player1.score + 1;
          gameInformation.Coin.x = Math.floor((Math.random() * 500) + 1);
          gameInformation.Coin.y = Math.floor((Math.random() * 250) + 1);
        }else if(coin(gameInformation.Player2.x, gameInformation.Player2.y, PlayerProperties.width, PlayerProperties.height, gameInformation.Coin.x,gameInformation.Coin.y) == true){
          gameInformation.Player2.score = gameInformation.Player2.score + 1;
          gameInformation.Coin.x = Math.floor((Math.random() * 500) + 1);
          gameInformation.Coin.y = Math.floor((Math.random() * 250) + 1);
        }

        //echo back the information of the game to who ever
        //sent the POST message
        res = JSON.stringify(gameInformation);
        console.log(res);
        response.end(res); //send just the JSON object
      }

      if (request.method == "GET") {
        //handle GET requests as static file requests
        fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err));
            //respond with not found 404 to client
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
          }
          response.writeHead(200, {
            "Content-Type": get_mime(urlObj.pathname)
          });
          response.end(data);
        });
      }
    });
  })
  .listen(3000);

console.log("Server Running at http://127.0.0.1:3000  CNTL-C to quit");
