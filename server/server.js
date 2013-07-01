var util = require("util");
var io = require("socket.io").listen(3000);
var players;

io.configure(function() {
  io.set("transports", ["websocket"]);
  io.set("log level", 2);
});

//Player class(outsource it later...)
var Player = function(spawnX, spawnY) {
  var X = spawnX;
  var Y = spawnY;
  var id;

  var getX = function() {
    return X;
  };

  var getY = function() {
    return Y;
  };

  var setY = function(newY) {
    Y = newY;
  };

  var setX = function(newX) {
    X = newX;
  };

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    id: id
  };
};

// init function
function init() {
  players = [];
  setEventHandlers();
};

var setEventHandlers = function() {
  io.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
  util.log("A new player connected: id " + client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
  client.on("get players", onGetPlayers);
};

function onGetPlayers(data) {
  var remotePlayers = [];
  for(i = 0; i < players.length; i++) {
    remotePlayers.push({id: players[i].id, x: players[i].getX(), y: players[i].getY()});
  }
  this.emit('get players', remotePlayers);
};

function onClientDisconnect() {
  util.log("Player disconnected: id " + this.id);
  for(i = 0; i < players.length; i++) {
    if(players[i].id == this.id) {
      this.broadcast.emit('remove player', players[i]);
      players.splice(i, 1);
    }
  }
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  players.push(newPlayer);
  this.broadcast.emit("new player", {id: newPlayer.id, x: data.x, y: data.y});
};

function onMovePlayer(data) {
  var player = updatePlayer(this.id, data.x, data.y);
  this.broadcast.emit("update move", {id: this.id, x: data.x, y: data.y});
};

function updatePlayer(player_id, data_x, data_y) {
  for(i = 0; i < players.length; i++) {
   if(players[i].id == player_id) {
     players[i].setX(data_x);
     players[i].setY(data_y);
     return players[i];
   }
  }
};

init();
