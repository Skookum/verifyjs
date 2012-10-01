var express = require('express'),
    stylus = require('stylus'),
    path = require('path'),
    linter = require('./linter'),
    app = express();

module.exports = function(options) {
  options = options || {};

  app.locals({
    inspect: function (obj) {
      return '<pre>'+require('util').inspect(obj, true, 5)+'</pre>';
    },
    embed_json: function(obj, name) {
      var escaped = JSON.stringify(obj);
      return "<script> " + name + " = " + escaped + "; </script>";
    }
  });

  // Jade
  app.set('view engine', 'jade');

  // Stylus
  function compile(str, path) {
    return stylus(str)
      .set('compress', true)
      .set('filename', path);
  }

  var styles = stylus.middleware({
    src: path.join(__dirname, './'),
    dest: path.join(__dirname, './public'),
    compile: compile,
    force: true
  });

  app.use(styles);
  app.use(express['static'](path.join(__dirname, 'public')));


  linter.hint(options);

  app.get('/*', function(req, res) {
    return res.render(path.join(__dirname, 'viewer'), {summary: linter.summary, results:linter.errors});
  });

  app.listen(options.port || 8080);
};