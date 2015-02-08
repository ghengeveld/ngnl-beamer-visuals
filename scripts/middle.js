(function (d3) {
  'use strict';

  var settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    size: 150,
    offset: 0.8,
    colors: '#3e4876,#060610',
    colorMode: 'build',
    colorBuild: 'build9',
    colorSpace: 'hsl',
    colorWay: 1,
    lightDark: 6,
    responsive: false,
    startVisible: true
  };
  var options = {
    animOrder: 'in-out',
    animIn: 'effect28-top',
    delayIn: 0,
    durationIn: 2500,
    easyIn: 'linear',
    animOut: 'effect28-bottom',
    delayOut: 0,
    durationOut: 2500,
    easyOut: 'linear',
    eventOn: 'self',
    eventType: 'none',
    eventRepeat: true,
    viewportShift: 'none',
    beforeAnim: false,
    afterAnim: false
  };

  d3.select('.trigons').trigons(settings).trigonsAnimInit(options);

})(window.d3);