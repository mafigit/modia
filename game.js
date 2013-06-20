$(function() {

  var player_anim_left = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 8,
    delta: 64,
    rate: 40,
    offsety: 128,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_right = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 8,
    delta: 64,
    rate: 40,
    offsety: 192,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_right_run = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 8,
    delta: 64,
    rate: 40,
    offsety: 320,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_left_run = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 8,
    delta: 64,
    rate: 40,
    offsety: 256,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_idle_left = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 1,
    delta: 64,
    rate: 90,
    offsety: 0,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_idle_right = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 1,
    delta: 64,
    rate: 90,
    offsety: 64,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_air_left = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 2,
    delta: 64,
    rate: 90,
    offsety: 384,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

  var player_anim_air_right = new $.gQ.Animation({ imageURL: "./sprites/player_default/player_default.png",
    numberOfFrame: 2,
    delta: 64,
    rate: 90,
    offsety: 448,
    type: $.gQ.ANIMATION_HORIZONTAL
  });

// Generated with gQ's Tiles map editor

var animations = [];
animations[0] =  new $.gameQuery.Animation({
    imageURL:      './sprites/world/grass_spirte.png',
    type:          $.gameQuery.ANIMATION_HORIZONTAL,
    numberOfFrame: 8,
    delta:         64,
    rate:          200,
    offsetx:       0,
    offsety:       0
});


 // the tilemap array
var map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

// $('TODO:select the playground here').playground({height: 64, width: 350});
$.playground()
  //start the game
  $("#playground").playground({height: 645, width: 1024, refreshRate: 60,keyTracker: true})
  .addTilemap('tilemap', map,  animations, {width: 64, height: 64, sizex: 16, sizey: 10});



  var World = {
    gravity: 3,
    refresh: 60,
    max_speed: 18
  };

  // touch controls
  var left_stick = {
    x: 0,
    y: 0
  }

  var deviceAgent = navigator.userAgent.toLowerCase();
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  if(agentID) {
    $('.touch_ctrl').show();
  }
  $('#output').bind('touchstart', function(e) {
    event.preventDefault();
    var orig = e.originalEvent
    $('#left_stick').css({'left':orig.changedTouches[0].pageX - 20, 'top':orig.changedTouches[0].pageY - 20});
  });
  $('#output').bind('touchmove', function(e) {
    event.preventDefault();
    var orig = e.originalEvent
    left_stick.x = orig.changedTouches[0].pageX - $('#left_stick').position().left -20;
    left_stick.y = orig.changedTouches[0].pageY - $('#left_stick').position().top -20;
    $('#output').text(left_stick.y + "," + left_stick.x);
    if(left_stick.x < -10) {
      $.gQ.keyTracker[37] = true;
      $.gQ.keyTracker[39] = false;
      $.gQ.keyTracker[68] = false;
    }
    if(left_stick.x < -60) {
      $.gQ.keyTracker[37] = true;
      $.gQ.keyTracker[39] = false;
      $.gQ.keyTracker[68] = true;
    }

    if(left_stick.x > 10) {
      $.gQ.keyTracker[37] = false;
      $.gQ.keyTracker[39] = true;
      $.gQ.keyTracker[68] = false;
    }

    if(left_stick.x > 60) {
      $.gQ.keyTracker[37] = false;
      $.gQ.keyTracker[39] = true;
      $.gQ.keyTracker[68] = true;
    }

  });
  $('#output').bind('touchend', function(e) {
    $.gQ.keyTracker[37] = false;
    $.gQ.keyTracker[39] = false;
  });

  $('#right_button').bind('touchstart', function(e) {
    $.gQ.keyTracker[70] = true;
  });
  $('#right_button').bind('touchend', function(e) {
    $.gQ.keyTracker[70] = false;
  });

  $.playground().startGame(function(){
    $("#welcomeScreen").remove();
  });

  function animate(player, anim) {
    if(player.current_animation != anim) {
      $('#player' + player.id).setAnimation(anim);
      player.current_animation = anim;
    }
  };

  function player_state(player, state) {
    switch(state) {
      case 'go_left_normal':
        if(player.air) {
          animate(player, player_anim_air_left);
        } else if($.gQ.keyTracker[68]){
          animate(player, player_anim_left_run);
        } else {
          animate(player, player_anim_left);
        }
        break;
      case 'go_right_normal':
        if(player.air) {
          animate(player, player_anim_air_right);
        } else if($.gQ.keyTracker[68]){
          animate(player, player_anim_right_run);
        } else {
          animate(player, player_anim_right);
        }
        break;
      case 'idle':
        if(player.air) {
          if(player.facing == 'right') {
            animate(player, player_anim_air_right);
          }
          if(player.facing == 'left') {
            animate(player, player_anim_air_left);
          }
        } else {
          if(player.facing == 'right') {
            animate(player, player_anim_idle_right);
          }
          if(player.facing == 'left') {
            animate(player, player_anim_idle_left);
          }
        }
    }
  };


  //player class
  //initialize player
  var Player = function(id, x, y) {
    _self = this;
    this.speed = 0;
    this.id = id;
    this.x = x;
    this.y = y;
    this.air = true;
    this.state = 'idle_right';
    this.facing = 'right'
    this.current_animation = player_anim_idle_left;
    //states: 0 == idle(default), 1 == move_left, 2 == move_right, 3 == jump;
    this.left = function() {
      player_state(_self, 'go_left_normal');
      _self.facing = 'left';
      if($.gQ.keyTracker[68]) {
        _self.x = _self.x - 12;
      } else {
        _self.x = _self.x - 5;
      }
    };
    this.right = function() {
      player_state(_self, 'go_right_normal');
      _self.facing = 'right';
      if($.gQ.keyTracker[68]) {
        _self.x = _self.x + 12;
      } else {
        _self.x = _self.x + 5;
      }
    };
    this.idle = function() {
      player_state(_self, 'idle');
    };
    this.jump = function() {
      if(_self.air == false) {
        _self.speed = -20;
      }
    };
    this.update = function() {
      if($('#player' + _self.id).collision().length > 0 && _self.speed != -20) {
        _self.air = false;
        _self.speed = 0;
      }
      else {
        _self.y = _self.y + World.gravity + _self.speed;
        _self.air = true;
        if(_self.speed < World.max_speed) {
          _self.speed = _self.speed + World.gravity;
        }
      }
      $('#player' + _self.id).x(_self.x);
      $('#player' + _self.id).y(_self.y);
    };
    this.add_player_sprite = (function(){
      $.playground().addSprite('player' + _self.id,{animation: player_anim_idle_right, height: 64, width: 64, posx: x, posy: y});
    })();
  };

//  function update_players() {
//    $.each(players, function() {
//      this.update();
//    });
//  }

  var myplayer =  new Player(1,0,0);

  //player controls and main loop
  function keyboard_update () {
    var idle = true;
    if($.gQ.keyTracker[37]) {
      myplayer.left();
      idle = false;
    }
    if($.gQ.keyTracker[39]) {
      myplayer.right();
      idle = false;
    }

    if($.gQ.keyTracker[70]) {
      myplayer.jump();
      idle = false;
    }
    if($.gQ.keyTracker[40]) {
    }
    if(idle == true) {
     myplayer.idle();
    }
  }

  $.playground().registerCallback(function(){
    keyboard_update();
    myplayer.update();
  },World.refresh)

  //game ends here
});