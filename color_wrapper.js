var Sensor = require('./lego.js').Sensor;

var ColorSensor = function(port) {
  this._sensor = new Sensor(port);
  this._sensor.mode = this._sensor.modes.indexOf('COL-COLOR');
};

ColorSensor.prototype = {
  _colors: ['none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'],
  isColor: function(color) {
    var id = this._sensor.getValue(0);
    return color.toLowerCase() === this._colors[id];
  }

};

module.exports = ColorSensor;
