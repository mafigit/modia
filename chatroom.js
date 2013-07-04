/*chatroom.js
  Realtime chat for game finding*/
module.exports =  function Chatroom(port){
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
  };

  function onJoin(data)  {
    this.broadcast.emit("player joined", "blafoo");
  };

  function init() {
    setEventHandlers();
  };

  return {
    io : io,
    init: init
  }
};
