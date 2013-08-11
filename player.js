module.exports = function(spawnX, spawnY) {
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


