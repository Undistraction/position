Themeleon
=========

Node.js theme engine.

Examples
--------

Define a theme using Swig as template engine:

```js
var themeleon = require('themeleon')();

themeleon.use('swig'); // Not actually implemented

// Merge custom mixin
themeleon.use({

  /**
   * Log current source directory, destination directory, and context
   * variables.
   */
  log: function () {
    console.log(this.src, this.dest, this.ctx);
  },
});

module.exports = themeleon(__dirname, function (t) {
  t.copy('assets'); // Will copy `assets` in destination directory
  // t.copy('assets', 'foo'); // Other name in destination directory

  // Compile a Swig view as `index.html` in destination directory
  t.swig('views/index.html.swig', 'index.html');

  // Call the above mixin
  t.log();
});
```

Use the previously declared theme (assuming it's named
`themeleon-theme-foo`) in a dummy project:

```js
var theme = require('themeleon-theme-foo');

// Render the theme in `dest` directory with given variables
theme('dest', {
  some: 'variables',
  that: 'will be',
  passed: 2,
  the: 'theme',
});
```
