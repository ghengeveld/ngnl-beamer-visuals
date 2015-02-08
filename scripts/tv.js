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
    startVisible: true
  };
  var timer;
  var current;
  var interval;
  var slides = $('.slide');

  updateInterval(60000);

  $(function init() {
    d3.select(slides.find('.trigons')[0]).trigons($.extend({}, settings, {
      colors: '#b31526,#f5f5fa,#0f025d',
      colorBuild: 'build11',
      colorSpace: 'lab'
    }));
    d3.select(slides.find('.trigons')[1]).trigons($.extend({}, settings, {
      colors: '#961b1a,#150105'
    }));
    d3.select(slides.find('.trigons')[2]).trigons($.extend({}, settings, {
      colors: '#b31526,#f5f5fa,#0f025d',
      colorBuild: 'build11',
      colorSpace: 'lab'
    }));
    d3.select(slides.find('.trigons')[3]).trigons($.extend({}, settings, {
      colors: '#3e4876,#060610'
    }));

    slides.hide();

    start(true);

    function next(initial) {
      go(initial || current == slides.length - 1 ? 0 : current + 1, initial);
    }

    function go(to, initial) {
      if (to === current) {
        return;
      }
      if (!initial) {
        slides.eq(current).fadeOut(1000);
      }
      current = to;
      slides.eq(current).fadeIn(1000);
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
        case 37: // left
          go(current == 0 ? slides.length - 1 : current - 1);
          break;
        case 39: // right
          go(current == slides.length - 1 ? 0 : current + 1);
          break;
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
          stop();
          go(key - 49);
          break;
        case 32: // space
          if (timer) {
            stop();
          } else {
            start();
          }
          break;
        case 43: // +
          updateInterval(interval + 10000);
          break;
        case 45: // -
          updateInterval(interval - 10000);
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