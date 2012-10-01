#!/usr/bin/env node

// node_modules/jshint/bin/hint ./app > jshint.txt

var fs = require('fs'),
    basename = require('path').basename,
    extname = require('path').extname,
    _ = require("underscore"),
    jshint = require('jshint'),
    hint = jshint.JSHINT;

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
    
    if (stat && stat.isDirectory()) {
      if (ignoreDirectories.indexOf(basename(file)) > -1) return;
      fs.readdir(base_dir+"/"+file, function(err, files){
        files.map(function(f){
          return file + '/' + f;
        }).forEach(traverse);
      });
    } 
    else {
      hintFile(file);
    }
  }

  // lint file
  function hintFile(file) {
    if (extname(file) !== '.js') return;
    var filecontents = fs.readFileSync(base_dir+"/"+file, 'utf-8');
    var has_errors = hint(filecontents, linting_options);
    summary.num_files++;
    if (!has_errors) {
      errors[dir+"/"+file] = hint.errors;
    }
  }
}
