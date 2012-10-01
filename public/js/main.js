$(function() {
  $("li.file .filename").live('click', function(){
    $(this).parent().toggleClass("open");
  });

  window.VerifyVM = new Verify(files);
  ko.applyBindings(VerifyVM);

});

function Error(options, container) {
  options = options || {};

  this.reason = ko.observable(options.reason || '');
  this.character = ko.observable(options.character || '');
  this.line = ko.observable(options.line || '');
  this.evidence = ko.observable(options.evidence || '');

  this. description = ko.computed(function(){
    return this.line() + ":" + this.character() + " - " + this.reason();
  }, this);

  this.isComplexityError = options.reason && options.reason.indexOf('Cyclomatic complexity') > -1;
  this.complexity = this.isComplexityError ? options.reason.match(/(\()(\d*)(\))/)[2] : -1;

}

Error.prototype = {
  click: function() {
    VerifyVM.activeError(this);
  }
};

function File(options, container) {
  options = options || {};

  this.name = ko.observable(options.filename || '');
  this.dirs = (options.filename.split("/").splice(1));
  this.errors = ko.observableArray([]);

  this.hasComplexityError = ko.computed(function() {
    return _.any(this.errors(), function(e) {
      return e.isComplexityError;
    }) ;
  }, this);

  this.highestComplexity = ko.computed(function() {
    var max = _.max(this.errors(), function(e) {
      return parseInt(e.complexity, 10);
    }) ;
    return max ? max.complexity : -1 ;
  }, this);

  _.each(options.errors, function(e) {
    this.errors.push(new Error(e, this));
  }, this);
}

function Verify(files) {
  this.files = ko.observableArray([]);
  this.filterMode = ko.observable(false);

  this.activeError = ko.observable(null);

  this.hasActiveError = ko.computed(function() {
    return this.activeError() !== null;
  }, this);

  this.filesWithComplexityError = ko.computed(function(){
    var files = _.filter(this.files(), function(f) {
      return f.hasComplexityError();
    });

    var sorted = _.sortBy(files, function(f) {
      return parseInt(f.highestComplexity(), 10);
    });

    return sorted.reverse();
  }, this);

  this.fileList = ko.computed(function(){
    return this.filterMode() ? this.filesWithComplexityError() : this.files() ;
  }, this);

  this.numberOfFilesWithComplexityError = ko.computed(function(){
    return this.filesWithComplexityError().length;
  }, this);

  this.filterText = ko.computed(function(){
    return this.filterMode() ? "All Errors" : "MaxComplexity Errors";
  }, this);

  _.each(files, function(errors,filename) {
    this.files.push(new File({filename:filename, errors:errors}, this));
  }, this);

}

Verify.prototype = {
  switchFilter: function(){
    this.filterMode(!this.filterMode());
  },
  closeModal: function() {
    this.activeError(null);
  },
  stopProp: function(d, e) {
    e.preventDefault();
    e.stopPropagation();
  }
};