/*chatroom.js
  Realtime chat for game finding*/
module.exports =  function Chatroom(port){
  var User = function(uuid,username,id) {
    var username = username;
    var uuid = uuid;
    var id = id;
    return {
      uuid: uuid,
      username: username,
      id: id
    }
  };

  var players = [];
  var io = require("socket.io").listen(port);
  var escape = require('escape-html');

  io.configure(function() {
    io.set("transports", ["websocket"]);
    io.set("log level", 2);
  });

  var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
  };

  function getTimeStamp() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return  hours + ":" + minutes ;
  }

  function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function onSocketConnection(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("join", onJoin);
    client.on("getplayers", ongetPlayers);
    client.on("publicmessage", ongetPublicMessage);
  };

  function ongetPublicMessage(data) {
    for(i = 0; i < players.length; i++) {
      if(players[i].id == this.id) {
        var message = {
          timestamp: getTimeStamp(),
          username: players[i].username,
          message: escape(data),
          uuid: players[i].uuid,
          id: players[i].id
        }
        this.broadcast.emit("new publicmessage", message);
      }
    }
    this.emit("message success");
  };

  function onClientDisconnect() {
    for(i = 0; i < players.length; i++) {
      if(players[i].id == this.id) {
        this.broadcast.emit('remove player', players[i]);
        players.splice(i, 1);
      }
    }
  };

  function onJoin(data)  {
    var new_user = new User(data.uuid, data.username, this.id)
    players.push(new_user);
    this.broadcast.emit("player joined", new_user);
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
