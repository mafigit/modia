$(function() {
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

  var User = function(uuid,username) {
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
    var username = username;
    return {
      uuid: uuid,
      username: username
    }
  };

  var getusername = function() {
    $.get('/getusername', function(data) {
      var username = $.parseJSON(data);
      appendusername(username);
      my_user.username = username;
      addUser(my_user);
    });
  };

  var appendusername = function(username) {
    $('#players').append("<div id='"+ my_user.uuid + "'>" + username +"</div>");
  };

  //create own User
  var my_user = new User();
  //get username with session
  getusername();

  socket = io.connect("http://127.0.0.1", {port: 5000, transports: ["websocket"]});
  socket.emit('getplayers');
  socket.on("setplayers", function(data) {
    $.each(data, function(i,player) {
      Users.push(player);
      console.log(player);
      $('#players').append("<div id='"+ player.uuid + "'>" + player.username + "</div>");
    });
  });
  socket.emit('join',my_user);
  socket.on("player joined", function(data) {
    var new_user = new User(data.uuid, data.username);
    addUser(new_user);
    $('#players').append("<div id='"+ new_user.uuid + "'>" + new_user.username + "</div>");
  });
});
