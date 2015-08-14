
var Wrappers = require('./wrappers');
var Mat = new Wrappers.Mat('outB', 'outC');
var Teye = new Wrappers.Teye('in2', 'in3', 'in4');

while (1) {

  var state = "";

  if(Teye.isState(['white', 'black', 'white'])
  || Teye.isState(['black', 'black', 'black'])) {
    Mat.runForever(60);
  }

  if(Teye.isState(['black', 'white', 'white'])
  || Teye.isState(['black', 'black', 'white'])) {
    Mat.rotate('left', 60);
  }

  if(Teye.isState(['white', 'white', 'black'])
  || Teye.isState(['white', 'black', 'black'])) {
    Mat.rotate('right', 60);
  }

  if(Teye.isState(['red', 'black', 'white'])
  || Teye.isState(['red', 'black', 'black'])) {
    // Mat.translate('left');
    Mat.runForever(20, 60);
  }

  if(Teye.isState(['white', 'black', 'red'])) {
    //Mat.translate('right');
  }

  if(Teye.isState(['none', 'none', 'none'])) {
    Mat.stop();
  }

}
