//This code is based on the Sample Code given by Prof. Lou Nel.

//client maintained location of items
var gameInformation = {
  Name: "Server",
  Player1: {
    x: 50, y: 100, score: 0
  },
  Player2:{
    x:450, y:100, score: 0
  },
  Coin:{
    x:400 , y: 400, width: 10, height: 10
  }
}

// Client mantained properties of a player
var PlayerProperties = {
  width: 50, height: 50
}

var timer; //used to control the free moving word
var pollingTimer; //timer to poll server for location updates

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById("canvas1"); //our drawing canvas

var drawCanvas = function() {
  var context = canvas.getContext("2d");

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

  //Draw Player 1
  context.fillStyle = "blue";
  context.fillRect(gameInformation.Player1.x, gameInformation.Player1.y, PlayerProperties.width, PlayerProperties.height);

  //If chosen Player 1 draw Square Identifier
  if(document.getElementById('player').value == "Player1"){
    context.fillStyle = "orange";
    context.fillRect(gameInformation.Player1.x + PlayerProperties.width/4, gameInformation.Player1.y + PlayerProperties.height/4,
       PlayerProperties.width/4, PlayerProperties.height/4);
  }

  //Draw Player 2
  context.fillStyle = "red";
  context.fillRect(gameInformation.Player2.x, gameInformation.Player2.y, PlayerProperties.width, PlayerProperties.height);

  //If chosen Player 2 draw Square Identifier
  if(document.getElementById('player').value == "Player2"){
    context.fillStyle = "orange";
    context.fillRect(gameInformation.Player2.x + PlayerProperties.width/4, gameInformation.Player2.y + PlayerProperties.height/4,
       PlayerProperties.width/4, PlayerProperties.height/4);
  }

  //Draw Coin
  context.fillStyle = "yellow";
  context.fillRect(gameInformation.Coin.x, gameInformation.Coin.y, gameInformation.Coin.width, gameInformation.Coin.height);

  //Write Scores on Screen
  document.getElementById('Player1').textContent = "Player 1: " + gameInformation.Player1.score;
  document.getElementById('Player2').textContent = "Player 2: " + gameInformation.Player2.score;
  context.stroke();
};

//Update Canvas
function handleTimer() {
  console.log("Game Status: " + JSON.stringify(gameInformation));
  drawCanvas();
}

//KEY CODES
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;

//Polling function
function pollingTimerHandler() {
  //Used name texto to avoid confusion with text
  //It represents the text on the text field
  var texto = document.getElementById('player');
  console.log("Usuario: " + texto.value);
  var dataObj = gameInformation;
  gameInformation.Name = 'Server' //used by server to react as poll
  //create a JSON string representation of the data object
  var jsonString = JSON.stringify(dataObj);

  //Poll the server for the information of the game
  $.post("positionData", jsonString, function(data, status) {
    // console.log("data: " + data);
    // console.log("typeof: " + typeof data);
    var locationData = JSON.parse(data);
    console.log("Parsed: " + locationData);
    //Update Game Status
    gameInformation.Player1.x = locationData.Player1.x;
    gameInformation.Player1.y = locationData.Player1.y;
    gameInformation.Player1.score = locationData.Player1.score;
    gameInformation.Player2.x = locationData.Player2.x;
    gameInformation.Player2.y = locationData.Player2.y;
    gameInformation.Player2.score = locationData.Player2.score;
    gameInformation.Coin.x = locationData.Coin.x;
    gameInformation.Coin.y = locationData.Coin.y;
  });
}

function handleKeyDown(e) {
  console.log("keydown code = " + e.which);
  var texto = document.getElementById('player');

  gameInformation.Name = texto.value;
  var MovingPlayer = {x: -1, y: -1};

  if(texto.value == "Player1"){
    MovingPlayer.x = gameInformation.Player1.x;
    MovingPlayer.y = gameInformation.Player1.y;
  } else if(texto.value == "Player2"){
    MovingPlayer.x = gameInformation.Player2.x;
    MovingPlayer.y = gameInformation.Player2.y;
  }

  var dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && MovingPlayer.y >= dXY) MovingPlayer.y -= dXY; //up arrow
  if (
    e.which == RIGHT_ARROW &&
    MovingPlayer.x + PlayerProperties.width + dXY <= canvas.width
  )
    MovingPlayer.x += dXY; //right arrow
  if (e.which == LEFT_ARROW && MovingPlayer.x >= dXY) MovingPlayer.x -= dXY; //left arrow
  if (
    e.which == DOWN_ARROW &&
    MovingPlayer.y + PlayerProperties.height + dXY <= canvas.height
  )
    MovingPlayer.y += dXY; //down arrow

  //upate server with position data
  if(texto.value == "Player1"){
    gameInformation.Player1.x = MovingPlayer.x;
    gameInformation.Player1.y = MovingPlayer.y;
  } else if(texto.value == "Player2"){
    gameInformation.Player2.x = MovingPlayer.x;
    gameInformation.Player2.y = MovingPlayer.y;
  }
  var jsonString = JSON.stringify(gameInformation);
  console.log("Sending Information ", jsonString);

  //update the server with a new location of the moving box
  $.post("positionData", jsonString, function(data, status) {
    //do nothing
  });
}

function handleKeyUp(e) {
  console.log("key UP: " + e.which);
  var jsonString = JSON.stringify(gameInformation);

  $.post("positionData", jsonString, function(data, status) {
    console.log("data: " + data);
    console.log("typeof: " + typeof data);
  });
}

$(document).ready(function() {
  $(document).keydown(handleKeyDown);
  $(document).keyup(handleKeyUp);

  timer = setInterval(handleTimer, 100); //tenth of second
  pollingTimer = setInterval(pollingTimerHandler, 100); //quarter of a second

  drawCanvas();
});
