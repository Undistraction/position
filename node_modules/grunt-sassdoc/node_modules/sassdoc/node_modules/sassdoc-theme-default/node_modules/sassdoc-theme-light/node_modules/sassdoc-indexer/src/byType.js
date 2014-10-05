'use strict';

var eachItem = require('./eachItem');

module.exports = function (data) {
  var byType = {};

  eachItem(data, function (item, type) {
    if (!(type in byType)) {
      byType[type] = [];
    }

    byType[type].push(item);
  });

  return byType;
};
