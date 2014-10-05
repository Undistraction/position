'use strict';

var assert = require('assert');

describe('#byType', function () {
  var indexByType = require('../src/byType');

  it('should group by type', function () {
    var data = {
      'function': {
        'name': {
          'name': 'name',
        },
      },
      'mixin': {
        'name': {
          'name': 'name',
        },
      },
    };

    var expected = {
      'function': [{'name': 'name'}],
      'mixin': [{'name': 'name'}],
    };

    assert.deepEqual(indexByType(data), expected);
  });
});
