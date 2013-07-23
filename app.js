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

// Test
function findById (id, fn) {
  var user = {id: 1, username: 'bob', password: 'secret', email: 'bob@example.com'};
  return fn(null, user);
};

// returns user object by finding username by username
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
  });
};

function findByUserid (userid, fn) {
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback () {
    User.find({'_id' : userid}, function(err,users) {
      var instance = users[0];
      mongoose.connection.close();
      return fn(null, instance);
    });
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
app.get('/signup', function(req, res) {
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

function prettyJSON(obj) {
  return JSON.stringify(obj.username, null, 2);
}

app.get('/getusername', ensureAuthenticated, function(req, res) {
  var userid = req.session.passport.user;
  findByUserid(userid, function(err, user) {
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(prettyJSON(user), 'utf-8');
  });
});

app.get('/gameroom', ensureAuthenticated, function(req, res) {
  fs.readFile('./views/gameroom.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      util.log(util.inspect(req.session.passport.user));
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
  res.redirect('/login');
});

// routes
http.createServer(app).listen(app.get('port'), function() {
  util.log('Express server listening on port ' + app.get('port'));
});

// game logic
var util = require("util");
// chat rooms
var Chatroom = require('./chatroom.js');
var chatroom1  = new Chatroom(5000);
chatroom1.init();

var Gameroom = require('./gameroom.js');
var gameroom1 = new Gameroom(3000);
gameroom1.init();
var gameroom2 = new Gameroom(3001);
gameroom2.init();
var gameroom3 = new Gameroom(3002);
gameroom3.init();
