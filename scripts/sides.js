(function ($, d3) {
  'use strict';

  var settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    size: 150,
    offset: 0.8,
    colorMode: 'build',
    colorBuild: 'build9',
    colorSpace: 'hsl',
    colorWay: 1,
    lightDark: 6,
    responsive: false,
    startVisible: false
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
  var busy;
  var timer;
  var current;
  var interval;
  var slides = $('.slide');

  updateInterval(60000);

  $(function init() {
    slides.find('.content').hide();

    d3.select(slides.find('.trigons')[0]).trigons($.extend({}, settings, {
      colors: '#3e4876,#060610'
    })).trigonsAnimInit(options);
    d3.select(slides.find('.trigons')[1]).trigons($.extend({}, settings, {
      colors: '#961b1a,#150105'
    })).trigonsAnimInit(options);

    start(true);

    function next(initial) {
      go(initial || current == slides.length - 1 ? 0 : current + 1, initial);
    }

    function go(to, initial) {
      if (busy || to === current) {
        return;
      }
      busy = true;
      if (!initial) {
        slides.find('.content').eq(current).fadeOut(options.durationOut - 500);
        d3.select(slides.find('.trigons')[current]).trigonsAnimOut(true);
      }
      setTimeout(function () {
        slides.eq(current).hide();
        current = to;
        slides.eq(current).show();
        d3.select(slides.find('.trigons')[current]).trigonsAnimIn(true);
        slides.find('.content').eq(current).fadeIn(options.durationIn - 500);
        setTimeout(function () {
          busy = false;
        }, options.durationIn);
      }, initial ? 0 : options.durationOut + 500);
    }

    function start(initial) {
      next(initial);
      timer = setTimeout(function delay() {
        next();
        timer = setTimeout(delay, interval);
      }, interval);
    }

    function stop() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = undefined;
    }

    document.onkeyup = function (e) {
      e = e || window.event;
      var key = (typeof e.which == "number") ? e.which : e.keyCode;
      switch (key) {
        case 32: // space
          if (timer) {
            stop();
          } else {
            start();
          }
          break;
        case 37: // left
          go(current == 0 ? slides.length - 1 : current - 1);
          break;
        case 39: // right
          go(current == slides.length - 1 ? 0 : current + 1);
          break;
        case 38: // up
          updateInterval(interval + 10000);
          break;
        case 40: // down
          updateInterval(interval - 10000);
          break;
        case 49: // 1
        case 50: // 2
          stop();
          go(key - 49);
          break;
      }
    };
  });

  function updateInterval(newval) {
    if (newval >= 10000) {
      interval = newval;
      $('#interval').text(interval / 1000 + 's').show();
      setTimeout(function () {
        $('#interval').fadeOut();
      }, 1000);
    }
  }

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id = id;
      js.src = "//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, "script", "twitter-wjs");

  CustomizeTwitterWidget({
    "url": "styles/twitter.css"
  });

})(window.jQuery, window.d3);