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
  var state = 'idle';
  var facing = 'right';
  var running = false;
  var air = true;

  var getAir = function() {
    return air;
  };

  var setAir = function(newAir) {
    air = newAir;
  }

  var getX = function() {
    return X;
  };

  var getState = function() {
    return state;
  };

  var setState = function(newState) {
    state = newState;
  };

  var setRunning = function(newRunning) {
    running = newRunning;
  };

  var getRunning = function() {
    return running;
  };

  var getFacing = function() {
    return facing;
  };

  var setFacing = function(newFacing) {
    facing = newFacing;
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

  var anim

  return {
    setAir: setAir,
    getAir: getAir,
    setState: setState,
    getState: getState,
    getFacing: getFacing,
    setFacing: setFacing,
    setRunning: setRunning,
    getRunning: getRunning,
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
    remotePlayers.push(
      {
        id: players[i].id,
        x: players[i].getX(),
        y: players[i].getY(),
        state: players[i].getState(),
        facing: players[i].getFacing()
      }
    );
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
  this.broadcast.emit("new player", {id: newPlayer.id, x: data.x, y: data.y, state: 'idle', facing: 'right'});
};

function onMovePlayer(data) {
  var player = updatePlayer(this.id, data.x, data.y, data.state, data.facing, data.running, data.air);
  this.broadcast.emit("update move", {id: this.id, x: data.x, y: data.y, state: data.state, facing: data.facing, running: data.running, air: data.air});
};

function updatePlayer(player_id, data_x, data_y, state, facing, running, air) {
  for(i = 0; i < players.length; i++) {
   if(players[i].id == player_id) {
     players[i].setX(data_x);
     players[i].setY(data_y);
     players[i].setState(state);
     players[i].setFacing(facing);
     players[i].setRunning(running);
     players[i].setAir(air);
     return players[i];
   }
  }
};

init();
