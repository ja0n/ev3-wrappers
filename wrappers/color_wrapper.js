var Sensor = require('./ev3').Sensor;

var ColorSensor = function(port) {
  this._sensor = new Sensor(port);
  this._sensor.mode = 'COL-COLOR';
};

ColorSensor.prototype = {
  set mode (mode) { return this_sensor.mode = mode },
  _colors: ['none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'],
  isColor: function(color) {
    var id = this._sensor.getValue(0);
    return color.toLowerCase() === this._colors[id];
  }

};

module.exports = ColorSensor;
