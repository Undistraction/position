'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var stripIndent = require('strip-indent');
var extend = require('lodash.assign');



/**
 * Extract all C-Style comments from the input code
 */
var CommentExtractor = (function () {
  var docCommentRegEx = /(?:[ \t]*\/\/\/.*\S*[\s]?)+$|^[ \t]*\/\*\*((?:[^*]|[\r\n]|(?:\*+(?:[^*/]|[\r\n])))*)(\*+)\//gm;

  /**
   * Generate a function that will index a buffer of text
   * and return a line for a specify char index
   *
   * @param {String} buffer buffer that is indexed
   * @return {Function} Function that translates an char index to line number
   */
  function index(buffer) {
    var indexData = {0: 0};

    for (var i = 0, length = buffer.length, line = 1; i < length; i++) {
      if (buffer[i] === '\n') {
        indexData[i + 1] = ++line;
      }
    }

    return function (offset) {
      for (var i = offset; i >= 0 && buffer[i] != '\n'; i--);
      return indexData[i + 1];
    };
  }

  var cleanBlockComment = function (comment) {
    var removeFirstLine = comment.replace(/^.*?[\r\n]+|[\r\n].*?$/g, '');
    var removeLeadingStar = removeFirstLine.replace(/^[ \t]*\*/gm, '');
    return stripIndent(removeLeadingStar).split(/\n/);
  };

  var cleanLineComments = function (comment) {
    var type;
    var lines = comment.split(/[\/]{3,}/);
        lines.shift();

    if (lines[0] !== undefined && comment.trim().indexOf('////') === 0){
      lines.shift(); // Remove line with stars
      type = 'poster';
    }

    var removedCommentChars = lines.join('').replace(/\n$/, '');

    // Remove indention and remove last element if empty
    lines = stripIndent(removedCommentChars).split('\n');

    return {
      lines : lines,
      type : type
    };
  };

  function CommentExtractor (parseContext) {
    this.parseContext = parseContext;
  }

  /**
   * Extract all comments from `code`
   * The `this.contextParser` to extract the context of the comment
   * @return {Array} Array of comment object like `{ lines : [array of comment lines], context : [result of contextParser] }`
   */
  CommentExtractor.prototype.extract = function (code) {
    var match;
    var comments = [];

    var lineNumberFor = index(code);

    while ( (match = docCommentRegEx.exec(code)) ) {
      var commentType = 'normal';
      var lines;
      // Detect if line comment or block comment
      if (match[1] === undefined){
        var lineObj = cleanLineComments(match[0]);
        lines = lineObj.lines;
        commentType = lineObj.type || commentType;
      } else {
        lines = cleanBlockComment(match[1]);
        // If there are more than one stare
        if (match[2].length > 1) {
          commentType =  'poster';
        }
      }

      var matchIndex = match.index + match[0].length;

      var lineNumberWithOffsetFor = function(offset){
        return lineNumberFor(matchIndex + offset);
      };

      comments.push({
        lines: lines,
        type: commentType,
        context: this.parseContext(code.substr(matchIndex), lineNumberWithOffsetFor)
      });
    }

    return comments;
  };

  return CommentExtractor;
})();


var isAnnotationAllowed = function (comment, annotation){
  if (comment.context.type && Array.isArray(annotation.allowedOn)) {
    return annotation.allowedOn.indexOf(comment.context.type) !== -1;
  }
  return true;
};

/**
 * Capable of parsing comments and resolving @annotations
 */
var CommentParser = (function(){
  var annotationRegex = /^@(\w+)/;

  function CommentParser (annotations) {
    EventEmitter.call(this);
    this.annotations = annotations;
  }

  util.inherits(CommentParser, EventEmitter);

  var parseComment = function (comment, annotations, emitter, posterComment) {
    var parsedComment = {
      description: '',
      context: comment.context
    };

    comment.lines.forEach(function (line) {
      var match = annotationRegex.exec(line);
      if (match) {
        var name = annotations._.alias[match[1]] || match[1]; // Resolve name from alias
        var annotation = annotations[name];

        if (annotation && annotation.parse){

          if (isAnnotationAllowed(comment, annotation)){

            if (typeof parsedComment[name] === 'undefined') {
              parsedComment[name] = [];
            }
            // Parse the annotation.
            var content = line.substr(match.index + match[0].length);
            var result = annotation.parse(content.replace(/^[ \t]+|[ \t]+$/g,''));

            // If it is a boolean use the annotaion as a flag
            if ( result === false || result === true) {
              parsedComment[name] = result;
            } else if ( result !== undefined ) {
              parsedComment[name].push( result );
            }
          } else {
            emitter.emit(
              'warning',
              new Error('Annotation "' + name + '" is not allowed on comment from type "' + comment.context.type + '"')
            );
          }

        } else { 
          emitter.emit('warning', new Error('Parser for annotation `' + match[1] + '` not found.'));
        }
      }

      else {
        parsedComment.description += line + '\n';
      }
    });



    // Save this as the PosterComment
    if (comment.type === 'poster'){
      // Only allow one posterComment per file
      if (Object.keys(posterComment).length === 0){
        extend(posterComment, parsedComment);
      } else {
        emitter.emit('warning', new Error('You can\'t have more than one poster comment.'));
      }
      // Don't add poster comments to the output
      return null;
    } else {
      // Merge in posterComment annotations and overwrite each annotation of item if it was not set
      Object.keys(posterComment).forEach(function(key){
        if (parsedComment[key] === undefined){
          parsedComment[key] = posterComment[key];
        }
      });
    }
    // Fill in defaults
    Object.keys(annotations).forEach(function (key){
      if ( key !== "_"){
        var defaultFunc = annotations[key].default;
        if ( defaultFunc !== undefined && parsedComment[key] === undefined ) {
          parsedComment[key] = [defaultFunc()];
        }
      }
    });

    return parsedComment;
  };

  /**
   * Parse the comments returned by the CommentExtractor.
   * Generate data use in the view
   */
  CommentParser.prototype.parse = function (comments) {
    var result = {};
    var posterComment = {};

    comments.forEach(function (comment) {
      var parsedComment = parseComment(comment, this.annotations, this, posterComment);
      if (parsedComment !== null){
        var type = comment.context.type;
        if (typeof result[type] === 'undefined') {
          result[type] = [];
        }
        result[type].push(parsedComment);
      }
    }, this);

    return result;
  };


  return CommentParser;
})();


module.exports.CommentParser = CommentParser;
module.exports.CommentExtractor = CommentExtractor;
