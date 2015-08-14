var Sensor = require('./color_wrapper');

var Teye = function(port1, port2, port3) {
  this._sensors = [new Sensor(port1), new Sensor(port2), new Sensor(port3)];
  //this.mode = 'COL-COLOR';
};

Teye.prototype = {
  _colors: ['none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'],
  set mode (mode) { return this._sensors[0].mode = this._sensors[1].mode = this._sensors[2].mode = mode },
  get left () { return this._sensors[0] },
  get middle () { return this._sensors[1] },
  get right () { return this._sensors[2] },
  isState: function(state) {
    return this._sensors[0].isColor(state[0])
        && this._sensors[1].isColor(state[1])
        && this._sensors[2].isColor(state[2])
        ;

  }

};

module.exports = Teye;
