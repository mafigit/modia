  socket = io.connect("http://192.168.5.38", {port: 5000, transports: ["websocket"]});
  socket.emit('join');
  socket.on("player joined", function(data) {
    console.log(data);
    $('#players').append(data + '<br />');
  });
