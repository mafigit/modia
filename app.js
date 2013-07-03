var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'Keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};

// User schema
var mongoose = require('mongoose');
var userschema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String
});
var User = mongoose.model('user', userschema);

function findById (id, fn) {
  var user = {id: 1, username: 'bob', password: 'secret', email: 'bob@example.com'};
  return fn(null, user);
};

function findByUsername (username, fn) {
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback () {
    User.find({'username' : username}, function(err,users) {
      var instance = users[0];
      mongoose.connection.close();
      return fn(null, instance);
    });
  });
};

// User session handling
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};
// add user
function addUser(newUsername, newPassword) {
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    var newuser = new User({username: newUsername, password: newPassword});
    newuser.save(function () {
      util.log("new user added:\nusername: " + newUsername +
        "\npassword: " + newPassword);
    });
    mongoose.connection.close();
    console.log(newuser);
  });
};

app.get('/', ensureAuthenticated, function(req, res) {
  fs.readFile('./public/main.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type':'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

// routes
app.get('/form', function(req, res) {
  fs.readFile('./views/form.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type':'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/login', function(req, res) {
  fs.readFile('./views/login.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type':'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

app.get('/gameroom', ensureAuthenticated, function(req, res) {
  fs.readFile('./views/gameroom.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type':'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

//login post
app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res) {
  res.redirect('/gameroom');
});

app.get('/game', function(req, res) {
  fs.readFile('./public/main.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type':'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  addUser(username, password);
  res.redirect('/form');
});

// routes
http.createServer(app).listen(app.get('port'), function() {
  util.log('Express server listening on port ' + app.get('port'));
});

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
