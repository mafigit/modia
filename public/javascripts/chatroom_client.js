var Users = [];

var addUser = function(user) {
  Users.push(user);
  console.log('User has been added')
};

var removeUser = function(user) {
  for(var i = 0; i < Users.length; i++) {
    if(Users[i].uuid == user.uuid) {
       console.log('User has been removed')
       socket.emit('remove player', Users[i]);
       Users.splice(i, 1);
    }
  }
};

var User = function(uuid) {
  if(uuid != null) {
    var uuid = uuid;
  } else {
    var uuid = function() {
      var result ='';
      for (var i = 0; i < 32; i ++) {
        result += Math.floor(Math.random()*16).toString(16).toUpperCase();
      }
      return result;
    }();
  }
  return {
    uuid: uuid
  }
};

var my_user = new User();
socket = io.connect("http://127.0.0.1", {port: 5000, transports: ["websocket"]});
socket.emit('join',my_user);
socket.on("player joined", function(data) {
  var new_user = new User(data.uuid);
  addUser(new_user);
  $('#players').append("<div id='"+ new_user.uuid + "'>Test</div>");
});
