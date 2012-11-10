should = require 'should'
assert = require 'assert'
util = require 'util'

analysis = require '../lib/analysis'
jshint = require '../lib/jshint'

file = 'test/fixtures/test.js'
filecontents = require('fs').readFileSync(file, 'utf-8')

options = 
  es5: true
  maxcomplexity: 0.5
  white: false
  sub: true
  lastsemic: true
  maxdepth: 2

describe 'JSHint', ->
  
  describe 'hintString', ->

    it 'should return a list of results', (done) ->
      jshint.hintString filecontents, options, (err, results) ->
        results.functionDetails.should.exist
        results.functionDetails.complexFunction.length.should.equal 1
        results.complexityErrors.should.exist
        results.complexityErrors.length.should.equal 6
        done()


  describe 'hintFile', ->

    it 'should return a list of results', (done) ->
      jshint.hintFile file, options, (err, results) ->
        console.log(util.inspect(results, false, null));
        results.functionDetails.should.exist
        results.functionDetails.complexFunction.length.should.equal 1
        results.complexityErrors.should.exist
        results.complexityErrors.length.should.equal 6
        done()