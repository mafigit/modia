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

  var User = function(uuid,username,id) {
    if(uuid != null) {
      var uuid = uuid;
      var id = id;
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
      username: username,
      id: id
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

  function getTimeStamp() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return  hours + ":" + minutes ;
  }

  //create own User
  var my_user = new User();
  //get username with session
  getusername();

  socket = io.connect("http://192.168.245.107", {port: 5000, transports: ["websocket"]});

  socket.emit('getplayers');

  socket.on("setplayers", function(data) {
    $.each(data, function(i,player) {
      Users.push(player);
      console.log(player);
      $('#players').append("<div id='"+ player.uuid + "'>" + player.username + "</div>");
    });
  });

  socket.on('remove player', function(data) {
    $("#" + data.uuid).remove();
    for(i = 0; i < Users.length; i++) {
      if(Users[i].uuid == data.uuid) {
        Users.splice(i, 1);
      }
    }
  });

  socket.emit('join',my_user);

  socket.on("new publicmessage", function(data) {
    var message = "<span class='chat_timestamp'>" + data.timestamp  + "</span>" + "<span class='chat_username'>" + data.username + "</span><span class='chat_message'>" + data.message + "</span><br>"
    $('#chatwindow').append(message);
    $("#chatwindow").scrollTop($("#chatwindow")[0].scrollHeight);
  });

  socket.on("player joined", function(data) {
    var new_user = new User(data.uuid, data.username);
    var usernames = [];
    $.each(Users, function(i, player) {
      usernames.push(player.username);
    });
    console.log(usernames);
    if($.inArray(data.username, usernames) == -1) {
      console.log('test');
      addUser(new_user);
      $('#players').append("<div id='"+ new_user.uuid + "'>" + new_user.username + "</div>");
    };
  });
  $('#chatprompt').keypress(function(e){
    if (e.keyCode == 13 && $("#chatprompt").val() != '') {
      var public_message = $("#chatprompt").val();
      console.log(public_message);
      socket.emit('publicmessage', public_message);
      $("#chatprompt").val('');
      var message = "<span class='chat_timestamp'>" + getTimeStamp() + "</span>" + "<span class='chat_username'>" + my_user.username + "</span><span class='chat_message'>" + public_message + "</span><br>"
      $('#chatwindow').append(message);
      $("#chatwindow").scrollTop($("#chatwindow")[0].scrollHeight);
    }
  });
});
