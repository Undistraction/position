var assert = require('assert');

describe('#byGroupAndType', function(){
  var indexByGroupAndType = require('../src/byGroupAndType');


  it('should group by group name and type', function(){

    var data = {
      'function' : {
        'name' : {
          'name' : 'name',
          'group' : [['test']]
        },
        'name1' : {
          'name' : 'name1',
          'group' : [['nogroup']]
        }
      },
      'mixin' : {
        'name' : {
          'name' : 'name',
          'group' : [['test']]
        },
        'name1' : {
          'name' : 'name1',
          'group' : [['nogroup']]
        }
      }
    };

    var expected = {
      'nogroup' : {
        'function' : [{'name' : 'name1', 'group' : [['nogroup']]}],
        'mixin' : [{'name' : 'name1', 'group' : [['nogroup']]}]
      },
      'test' : {
        'function' : [{'name' : 'name', 'group' : [['test']]}],
        'mixin' : [{'name' : 'name', 'group' : [['test']]}]
      }
    };

    assert.deepEqual(indexByGroupAndType(data), expected);

  });

});