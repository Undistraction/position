'use strict';

exports.src = function (fn) {
  return function (src) {
    arguments[0] = this.src + '/' + src;
    return fn.apply(this, arguments);
  };
};

exports.srcDest = function (fn) {
  fn = exports.src(fn);

  return function (src, dest) {
    if (typeof dest === 'undefined') {
      dest = src;
    }

    var args = Array.prototype.slice.call(arguments);
    args[1] = this.dest + '/' + dest;
    return fn.apply(this, args);
  };
};
