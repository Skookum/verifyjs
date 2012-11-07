#!/usr/bin/env node


var fs = require('fs'),
    basename = require('path').basename,
    extname = require('path').extname,
    _ = require("underscore"),
    jshint = require('./jshint');

var ignoreDirectories, 
    errors = {}, 
    summary  = {
      num_files: 0
    };

module.exports.errors = errors;
module.exports.summary = summary;

module.exports.hint = function(options) {
  options = options || {};
  ignoreDirectories = options.ignore || ['node_modules', 'test', 'bin', 'scripts', '.git'];
  lintfiles(options.base, options.dir, options.jshint);
};

function lintfiles(base, dir, linting_options){

  var base_dir = (!dir) ? base : base+"/"+dir;

  var files = fs.readdirSync(base_dir);

  files.forEach(traverse);

  // traverse file if it is a directory
  function traverse(file) {
    var stat = fs.statSync(base_dir+"/"+file);
    
    // is directory, call traverse on each of it's files?
    if (stat && stat.isDirectory()) {
      
      // is directory in exclusions?
      if (ignoreDirectories.indexOf(basename(file)) > -1) return;
      
      fs.readdir(base_dir+"/"+file, function(err, files){
        files.map(function(f){
          return file + '/' + f;
        }).forEach(traverse);
      });
    } 

    // file, analyse
    else {
      if (extname(file) === '.js') {
        summary.num_files++;
        jshint.hintFile(base_dir+"/"+file, linting_options, function(err, results) {
          console.log(results);
          if (results) errors[dir+"/"+file] = hint.errors;
        });
      }
    }
  }
}
