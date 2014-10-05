var fs = require('fs');
var assert = require('assert');
var ScssCommentParser = require('../');

var getContent = function(file){
  return fs.readFileSync(__dirname + '/fixtures/'+file, 'utf-8');
};


describe('ScssCommentParser', function () {
  describe('#contextParser', function () {
    var parser;

    beforeEach(function(){
      parser = new ScssCommentParser({});
    });

    describe('placeholder', function(){
      var expected = {
        type: 'placeholder',
        name: 'testPlaceholder',
        code: '\n  $some : "code";\n'
      };

      it('should detect it', function(){
        var context = parser.contextParser(getContent('placeholder.test.scss'));
        assert.deepEqual(context, expected);
      });

      it('should detect it with linebreaks', function(){
        var context = parser.contextParser(getContent('placeholderLinebreaks.test.scss'));
        assert.deepEqual(context, expected);
      });
    });

    describe('mixin', function(){
      var expected = {
        type: 'mixin',
        name: 'name',
        code: '\n  $some : "code";\n'
      };

      it('should detect it', function(){
        var context = parser.contextParser(getContent('mixin.test.scss'));
        assert.deepEqual(context, expected);
      });

      it('should detect it with linebreaks', function(){
        var context = parser.contextParser(getContent('mixinLinebreaks.test.scss'));
        assert.deepEqual(context, expected);
      });
    });

    describe('function', function(){
      var expected = {
        type: 'function',
        name: 'name',
        code: '\n  $some : "code";\n'
      };

      it('should detect it', function(){
        var context = parser.contextParser(getContent('function.test.scss'));
        assert.deepEqual(context, expected);
      });

      it('should detect it with linebreaks', function(){
        var context = parser.contextParser(getContent('functionLinebreaks.test.scss'));
        assert.deepEqual(context, expected);
      });
    });

    describe('variable', function(){
      var expected = {
        type: 'variable',
        name: 'name',
        value: '\'value\'',
        scope: 'private'
      };

      it('should detect it', function(){
        var context = parser.contextParser(getContent('variable.test.scss'));
        assert.deepEqual(context, expected);
      });

      it('should detect it with linebreaks', function(){
        var context = parser.contextParser(getContent('variableLinebreaks.test.scss'));
        assert.deepEqual(context, expected);
      });

      it('should detect it as global', function(){
        var context = parser.contextParser(getContent('variableGlobal.test.scss'));
        assert.deepEqual(context, {
          type: 'variable',
          name: 'name',
          value: '\'value\'',
          scope: 'global'
        });
      });

      it('should detect it with multiline Value', function(){
        var context = parser.contextParser(getContent('variableMultilineValue.test.scss'));
        assert.deepEqual(context, {
          type: 'variable',
          name: 'map',
          value: '(\n  \"a\": \"b\",\n  \"c\": \"\"\n)',
          scope: 'private'
        });
      });
    });

    describe('unknown', function(){
      it('should assing unknown', function(){
        var context = parser.contextParser(getContent('unknown.test.scss'));
        assert.deepEqual(context, {
          type : 'unknown'
        });
      });
    });
  });

  describe('#parser', function(){
    var parser;

    beforeEach(function(){
      parser = new ScssCommentParser({});
    });

    describe('group by type', function(){
      it('should work with block comments', function(){
        var result = parser.parse(getContent('groupByType.test.scss'));
        assert.deepEqual(result, require(__dirname + '/expected/groupByType.json'));
      });
      it('should work with mixed comments', function(){
        var result = parser.parse(getContent('groupByTypeMixedComments.test.scss'));
        assert.deepEqual(result, require(__dirname + '/expected/groupByType.json'));
      });
    });

    it('should ignore lines that start with "---"', function(){
        var result = parser.parse(getContent('ignoreLine.test.scss'));
        assert.equal(result['function'].length, 1);
        assert.deepEqual(result['function'][0], {
          description : 'Test\nTest\n',
          context : {
            type : 'function',
            line : {
              start : 6,
              end : 6
            },
            name : 'test',
            code : ''
          }
        });
    });


  });

  describe('#extractCode', function () {
    var parser;

    beforeEach(function(){
      parser = new ScssCommentParser({});
    });

    it('should extract a code block', function () {
      assert.equal(parser.extractCode('{{ test }}'), '{ test }');
      assert.equal(parser.extractCode('{{ test }} ignore'), '{ test }');
      assert.equal(parser.extractCode('{{ te"te}}st"st }} ignore'), '{ te"te}}st"st }');
      assert.equal(parser.extractCode('{{ te\'te}}st\'st }} ignore'), '{ te\'te}}st\'st }');
      assert.equal(parser.extractCode('{{ // }\n }} ignore'), '{ // }\n }');
      assert.equal(parser.extractCode('{{ /* }} */ }}'), '{ /* }} */ }');
    });
  });
});