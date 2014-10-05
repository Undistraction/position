'use strict';

var extend = require('extend');
var swig = new (require('swig').Swig)();
var extras = require('swig-extras');
var themeleon = require('themeleon')();
var filter = require('sassdoc-filter');
var indexer = require('sassdoc-indexer');

extras.useFilter(swig, 'split');
extras.useFilter(swig, 'trim');
extras.useFilter(swig, 'groupby');

swig.setFilter('push', function (arr, val) {
  return arr.push(val);
});

themeleon.use('swig', swig);

var theme = themeleon(__dirname, function (t) {
  var assetsPromise = t.copy('assets');

  if (t.ctx.shortcutIcon && t.ctx.shortcutIcon.type === 'internal') {
    assetsPromise.then(function () {
      return t.copy(t.ctx.shortcutIcon.path, t.ctx.shortcutIcon.url);
    });

    t.ctx.shortcutIcon.url = 'assets/img/' + t.ctx.shortcutIcon.url;
  }

  t.swig('views/documentation/index.html.swig', 'index.html');
});

module.exports = function (dest, ctx) {
  if (!('view' in ctx)) {
    ctx.view = {};
  }

  var defaultView = require('./view.json');
  ctx.view = extend({}, defaultView, ctx.view);
  ctx.view.groups = extend(defaultView.groups, ctx.view.groups);

  if (!ctx.view.display) {
    ctx.view.display = {};
  }

  ctx.view.display.annotations = {
    'function': ['description', 'parameters', 'returns', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'mixin': ['description', 'parameters', 'output', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'placeholder': ['description', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'variable': ['description', 'type', 'prop', 'requires', 'example', 'usedby', 'since', 'see', 'todo', 'link', 'author']
  };

  filter.markdown(ctx);
  filter.display(ctx);
  filter.groupName(ctx);
  filter.shortcutIcon(ctx);

  ctx.data.byGroupAndType = indexer.byGroupAndType(ctx.data);

  return theme.apply(this, arguments);
};
