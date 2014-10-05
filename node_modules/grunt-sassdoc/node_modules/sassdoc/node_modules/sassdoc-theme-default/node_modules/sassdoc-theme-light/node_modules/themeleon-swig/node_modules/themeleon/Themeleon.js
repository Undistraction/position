'use strict';

/**
 * Themeleon helper constructor.
 *
 * See the functions from `factory.js` for variables signification.
 *
 * This constructor has an empty prototype (except the `use` method) since
 * Themeleon works only with mixins. There's a main mixin in `main.js`
 * containing the base functions, and all the extensions are merged in the
 * same way on the object instance.
 *
 * The purpose of this constructor is only to create new instances with
 * conventional properties to be used by the mixins.
 *
 * @constructor
 * @param {string} src
 * @param {string} dest
 * @param {object} ctx
 */
module.exports = function Themeleon(src, dest, ctx) {
  this.tasks = [];
  this.src = src;
  this.dest = dest;
  this.ctx = ctx;

  // Shortcut to push a promise
  this.push = this.tasks.push.bind(this.tasks);
};

/**
 * Mix given object(s) with current instance.
 *
 * @param {...object} obj
 */
module.exports.prototype.use = function (obj) {
  for (var i = 0; i < arguments.length; i++) {
    for (var j in arguments[i]) {
      this[j] = arguments[i][j];
    }
  }
};
