/*chatroom.js
  Realtime chat for game finding*/
module.exports =  function Chatroom(port){
  var players = [];
  var io = require("socket.io").listen(port);

  io.configure(function() {
    io.set("transports", ["websocket"]);
    io.set("log level", 2);
  });

  var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
  };

  function onSocketConnection(client) {
    client.on("join", onJoin);
    client.on("getplayers", ongetPlayers);
  };

  function onJoin(data)  {
    var user = data;
    players.push(user);
    this.broadcast.emit("player joined", user);
  };

  function ongetPlayers()  {
    this.emit('setplayers', players);
  };

  function init() {
    setEventHandlers();
  };

  return {
    io : io,
    init: init
  }
};
