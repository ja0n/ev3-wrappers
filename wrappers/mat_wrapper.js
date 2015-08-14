var Motor = require('./ev3').Motor;

var Mat = function(port1, port2) {
  this._motor1 = new Motor(port1);
  this._motor2 = new Motor(port2);
};

Mat.prototype = {
  _dutyc: 50,
  get dutyCycle() {
    return [this._motor1.dutyCycleSp, this._motor2.dutyCycleSp];
  },
  set dutyCycle(val) {
    this._motor1.dutyCycleSp = val;
    this._motor2.dutyCycleSp = val;

    return val;
  },
  stop: function () {
    this._motor1.command = 'stop';
    this._motor2.command = 'stop';
  },
  runForever: function(dtSp, dtSp2) {
    if(dtSp) this.dutyCycle = dtSp;
    if(dtSp2) {
      this._motor1.dutyCycle = dtSp
      this._motor2.dutyCycle = dtSp2
    }
    this._motor1.command = 'run-forever';
    this._motor2.command = 'run-forever';
  },
  runTimed: function(cfg, time) {
    if(cfg[0] === '1') {
      this._motor1.timeSp = time;
      this._motor1.command = 'run-timed';
    }
    if(cfg[1] === '1') {
      this._motor2.timeSp = time;
      this._motor2.command = 'run-timed';
    }
  },
  rotate: function(side, dtSp, dtSp) {
    switch (side) {
      case 'left':
        this._motor1.dutyCycleSp = -dtSp
        this._motor2.dutyCycleSp = (dtSp || dtSp2)
        this._motor1.command = 'run-forever';
        this._motor2.command = 'run-forever';
        break;
      case 'right':
        this._motor1.dutyCycleSp = dtSp
        this._motor2.dutyCycleSp = -(dtSp || dtSp2)
        this._motor1.command = 'run-forever';
        this._motor2.command = 'run-forever';
        break;
    }
  },
  translate: function(side) {
    switch (side) {
      case 'left':
        this._motor1.command = 'stop';
        this._motor2.command = 'run-forever';
        break;
      case 'right':
        this._motor1.command = 'run-forever';
        this._motor2.command = 'stop';
        break;
    }
  },

};

module.exports = Mat;
