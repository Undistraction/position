var fs = require('fs');
var assert = require("assert");
var docParser = require('../');

describe('CDocParser', function(){

  var extractor = new docParser.CommentExtractor( function (){ return { type : 'testCtx'}; } );

  var getCommentsFrom = function(file){
    return extractor.extract(fs.readFileSync(__dirname + '/fixtures/'+file, 'utf-8'));
  };

  describe('CommentExtractor', function(){
    describe('#extract', function(){
      describe('Block comments', function(){
        it('should extract block comments', function(){
          var comments = getCommentsFrom('block.test.scss');
          assert.equal(comments.length, 2);
          assert.equal(comments[0].lines.length, 3);
          assert.equal(comments[0].context.type, 'testCtx');
          assert.deepEqual(comments[0].lines, ['', 'Block comment test', '']);
          assert.deepEqual(comments[1].lines, ['', 'Block comment test 2', '']);
        });

        it('should not split every "*"', function(){
          var comments = getCommentsFrom('blockSplitCorrect.test.scss');
          assert.deepEqual(comments[0].lines, [ '@param {*} $list - list to purge', 'Test', 'Test']);
        });

        it('should ignore block comments like /* comment */', function(){
          var comments = getCommentsFrom('blockNested.test.scss');
          assert.equal(comments.length, 2);
        });

        it('should normalize the indentation', function(){
          var comments = getCommentsFrom('blockIndentation.test.scss');
          assert.deepEqual(comments[0].lines, ['test', '   hello', '  world']);
        });
      });

      describe('Line comments', function(){
        it('should extract line comments', function (){
          var comments = getCommentsFrom('line.test.scss');
          assert.equal(comments.length, 2);
          assert.deepEqual(comments[0].lines, ['More', '', 'than', 'one', 'line']);
          assert.deepEqual(comments[1].lines, ['More', 'than', 'one','comment']);
        });

        it('should ignore block comments in line comments', function(){
          var comments = getCommentsFrom('lineIgnoreBlock.test.scss');
          assert.equal(comments.length, 1);
          assert.deepEqual(comments[0].lines, ['', '/**  test*/', '']);
        });

        it('should normalize the indentation', function(){
          var comments = getCommentsFrom('lineIndentation.test.scss');
          assert.deepEqual(comments[0].lines, ['', 'test', '   hello', '  world', '']);
        });

        it('should extract line commments with leading spaces', function(){
          var comments = getCommentsFrom('lineIndentionBefore.test.scss');
          assert.deepEqual(comments[0].lines, [ 'Just a test', '   ' ]);
          assert.deepEqual(comments[0].type, 'poster');
        });
      });

      describe('Mixed style comments', function(){
        it('should extract comments', function (){
          var comments = getCommentsFrom('mixed.test.scss');
          assert.equal(comments.length, 2);
          assert.deepEqual(comments[0].lines, ['', 'Block comment test', '']);
          assert.deepEqual(comments[1].lines, ['', 'Line comment test', '']);
        });
      });

    });
  });




  describe('CommentParser', function(){

    var parser;

    // Test comments
    var comments = [
      { lines : ['test', 'test', '@test'], context : { type : 'testType1'} },
      { lines : ['test', 'test', ' @test'], context : { type : 'testType1'} },
      { lines : ['test', '@ignore ingore this', 'test', '@ignore ingore this'], context : { type : 'testType1'} },
      { lines : ['test', 'test', '@aliasTest'], context : { type : 'testType2'} },
      { lines : ['test', 'test', '@test'], context : { type : 'testType2'} },
      { lines : ['test', 'test', '@test'], context : { type : 'testType3'} },
      { lines : ['test', 'test', '@flag'], context : { type : 'testType3'} },
      { lines : ['@multiline\nThis is a\nmultiline\nannotation\n'], context : { type : 'testType3'} }
    ];

    // Test Annotations
    var annotations = {
      _ : {
        alias : {
          "aliasTest" : "test"
        }
      },
      ignore : {
        parse : function() {}
      },
      test : {
        parse : function ( commentLine ){
          return "Working";
        },
        default : function(){
          return "Default";
        }
      },
      flag : {
        parse : function(){
          return true;
        }
      },
      multiline : {
        parse : function(commentLine){
          return commentLine;
        }
      },
      allowedLimited : {
        parse : function(){},
        allowedOn : ['workingType']
      }
    };


    beforeEach(function(){
      parser = new docParser.CommentParser( annotations );
    });


    describe('#parse', function(){
      it('should group comments by context type', function(){
       var result = parser.parse ( comments );
           assert.equal(result.testType1.length , 3);
           assert.equal(result.testType2.length , 2);
          assert.equal(result.testType3.length , 3);
      });

      it('should add default values', function(){
       var result = parser.parse ( comments );
            assert.equal(result.testType3[1].test[0] , 'Default' );
      });

      it('should join lines without annotation into description', function(){
       var result = parser.parse ( comments );
           assert.equal(result.testType1[0].description , 'test\ntest\n');
      });

      it('should resolve a alias to the real name', function(){
       var result = parser.parse ( comments );
           assert.equal(result.testType2.length , 2);
           assert.equal(result.testType2[0].test[0] , 'Working' );
      });

      it('should convert an annotation that returns a boolean to a flag', function(){
       var result = parser.parse ( comments );
            assert.equal(result.testType3[1].flag , true );
      });

      it('should parse a multiline annotation', function(){
       var result = parser.parse ( comments );
            assert.equal(result.testType3[2].multiline[0] , "\nThis is a\nmultiline\nannotation\n");
      });

      it('should ignore annotations that aren\'t at the start of the line', function(){
       var result = parser.parse ( comments );
            assert.equal(result.testType1[1].test[0] , 'Default');
      });

      it('should ignore annotations that won\'t return anything', function(){
       var result = parser.parse ( comments );
            assert.deepEqual(result.testType1[2].ignore , []);
      });

      it('should emit an error if annotation was not found', function(done){
        parser.on('warning', function(err){
          assert.equal(err + '', 'Error: Parser for annotation `notFound` not found.');
          done();
        });
        var result = parser.parse ( [{ lines : ['@notFound'], context : { type : 'testType1'} }] );
      });

      it('should apply annotations in a block poster comment to each item', function () {
        var comments = getCommentsFrom('blockPoster.test.scss');
        var result = parser.parse ( comments );
        assert.equal(result.testCtx.length  , 2);
        assert.equal(result.testCtx[0].flag , undefined);
        assert.equal(result.testCtx[1].flag , true);
      });

      it('should apply annotations in a line poster comment to each item', function () {
        var comments = getCommentsFrom('linePoster.test.scss');
        var result = parser.parse ( comments );
        assert.equal(result.testCtx.length  , 2);
        assert.equal(result.testCtx[0].flag , undefined);
        assert.equal(result.testCtx[1].flag , true);
      });

      it('should emit an error if more than one poster comment was used', function(done){
        var comments = extractor.extract('/**\n * Poster Comment\n **/ \n\n\n /**\n * Poster Comment\n **/');

        parser.on('warning', function(err){
          assert.equal(err + '', 'Error: You can\'t have more than one poster comment.');
          done();
        });
        var result = parser.parse (comments);
      });

      it('should emit an warning if not allowed comment type', function(done){
        parser.on('warning', function(err){
          assert.equal(err + '', 'Error: Annotation "allowedLimited" is not allowed on comment from type "testType3"');
          done();
        });
        var result = parser.parse ([{
          lines : ['@allowedLimited'],
          context : { type : 'testType3'}
        }]);
      });

      it('should work on allowed context.type', function(){
        var result = parser.parse ([{
          lines : ['@allowedLimited'],
          context : { type : 'workingType'}
        }]);
        assert.deepEqual(result.workingType[0].allowedLimited , []);
      });

    });
  });
});