'use strict';

var Themeleon = require('./Themeleon');
var main = require('./main');

/**
 * Themeleon factory.
 *
 * @return {function}
 */
module.exports = function factory() {

  /**
   * Wraps a high-level `render` function for a theme localized in
   * `dirname` to implement the Themeleon interface.
   *
   * @param {string} src Theme package directory.
   * @param {function} proc The render procedure.
   * @return {function} Main theme function wrapping the render function.
   */
  function themeleon(src, proc) {

    /**
     * Actual Themeleon interface implementation using previous `render`
     * function.
     *
     * @param {string} dest Directory to render theme in.
     * @param {object} ctx Variables to pass to the theme.
     * @return {promise} A Promises/A+ implementation.
     */
    return function render(dest, ctx) {
      var t = new Themeleon(src, dest, ctx);
      t.use.apply(t, themeleon.exts);
      proc(t);
      return t.promise();
    };
  }

  /**
   * @var {array} Container for Themeleon extensions.
   */
  themeleon.exts = [main];

  /**
   * Use a Themeleon extension.
   *
   * If the `ext` parameter is a string, a `themeleon-{{ ext }}` package
   * will be required to get the mixin constructor.
   *
   * If it's a function, we assume it is already the mixin constructor,
   * and it's called with given arguments.
   *
   * If it's an object, we assume it's directly the extension mixin.
   *
   * @param {string|function|object} ext Extension to include.
   * @param {...*} arg Optional arguments for mixin constructor.
   */
  themeleon.use = function (ext, arg) {
    if (typeof ext === 'string') {
      ext = require('themeleon-' + ext);
    }

    if (typeof ext === 'function') {
      var args = Array.prototype.slice.call(arguments, 1);
      ext = ext.apply(null, args);
    }

    themeleon.exts.push(ext);

    return themeleon;
  };

  return themeleon;
};
