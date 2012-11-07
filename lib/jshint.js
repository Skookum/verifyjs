var jshint = require('jshint'),
    hint = jshint.JSHINT,
    _ = require("underscore");


// function to take a string and run jshint on it
var hintString = function hintString(string, options, callback) {
  hint(string, options);

  var results = hint.data(), 
      functionDetails = {},
      byLine = {};  // function name lookup by line

  // build hash of functions by name    
  _.each(results.functions, function(func) {
    
    var name = funcName(func);
    
    func.errors = [];

    if (!functionDetails[name]) functionDetails[name] = [];
    functionDetails[name].push(func);
    byLine[func.line+":"+(func.character-1)] = name;
  });

  results.complexityErrors = [];

  _.each(results.errors, function(err) {

    // if complexity error, add complexity to initial function object
    if (isComplexityError(err)) {
      
      // look up function name in line:char hash
      var funcName = byLine[err.line+":"+err.character];
      if (funcName) {
        
        // pull complexity from string with regex
        var complexity = err.reason.match(/(\()(\d*)(\))/)[2];
        _.each(functionDetails[funcName], function(f) {
          if (inFunction(err, f)) f.complexity = complexity;
        });
        results.complexityErrors.push(err);
      }
    }

    // test other errors to find ones that are in functions
    else {
      addErrorToFunction(err, functionDetails);
    }
  });

  results.functionDetails = functionDetails;

  return callback(null, results);
};


// takes a file path and reads the file into memory and then runs the string 
// through hintString
var hintFile = function hintFile(path, options, callback) {
  var filecontents = require('fs').readFileSync(path, 'utf-8');
  hintString(filecontents, options, callback);
};


// export functions
module.exports.hintString = hintString;
module.exports.hintFile = hintFile;


function isComplexityError(err) {
  return err.raw.indexOf("Cyclomatic complexity") > -1;
}

function funcName(func) {
  return func.name.replace(/'/g, '').replace(/"/g, '');
}

function addErrorToFunction(err, functions) {

  // loop through all groups of functions (grouped by name)
  _.each(functions, function(group) {
    
    // loop through all functions in group
    _.each(group, function(func) {
      if (inFunction(err, func)) func.errors.push(err);
    });
  });

  return;
}


function inFunction(err, func) {
  var line = err.line,
      character = err.character;

  // is error placement outside bounds of function?
  if (func.line > line || func.last < line) return false;

  // is error on first line, but before char start of function
  if (func.line === line && func.character < character) return false;

  // is error on last line, but after lastchar of function
  if (func.last === line && func.lastcharacter < character) return false;

  return true;
}