'use strict';

var removeFile = require('../index');
var expect = require('expect.js');
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-file-remover', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('deletes the specified srcFile by default', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = removeFile(sourcePath, {
      srcFile: '/lib/main.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {

      expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
      expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
      expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.be.ok();
    });
  })

  describe('accepts an array of objects as the `files` option', function() {
    it('deletes all files provided', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = removeFile(sourcePath, {
        files: [ '/lib/main.js', '/lib/core.js']
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.be.ok();
      });
    })
  });

  describe('accepts an array of paths to be removed', function() {
    it('deletes all paths provided (directories)', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = removeFile(sourcePath, {
        paths: [ '/lib', '/some-dir']
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/some-dir/test.txt')).to.not.be.ok();
        expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.not.be.ok();
      });
    })

    it('deletes all paths provided (directory that is the target of a symlink)', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = removeFile(sourcePath, {
        paths: [ '/linked-dir']
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.be.ok();
        expect(fs.existsSync(dir + '/some-dir/test.txt')).to.be.ok();
        expect(fs.existsSync(dir + '/linked-dir')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.be.ok(); // should be fine
      });
    })

    it('deletes all paths provided (file that is the source of a symlinkd directory)', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = removeFile(sourcePath, {
        paths: [ '/lib/linked-dir/file']
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.be.ok();
        expect(fs.existsSync(dir + '/some-dir/test.txt')).to.be.ok();
        expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.not.be.ok();
      });
    })

    it('deletes all paths provided (absolute link)', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var path = require('path');
      var srcDir = path.resolve(sourcePath, 'linked-dir');
      var targetDir = path.resolve(sourcePath, 'lib/absolutely-linked-dir');

      try {
        fs.symlinkSync(srcDir, targetDir);

        var tree = removeFile(sourcePath, {
          paths: [ targetDir ]
        });

        builder = new broccoli.Builder(tree);
        return builder.build().then(function(dir) {
          expect(fs.existsSync(dir + '/lib/main.js')).to.be.ok();
          expect(fs.existsSync(dir + '/lib/core.js')).to.be.ok();
          expect(fs.existsSync(dir + '/some-dir/test.txt')).to.be.ok();
          expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
          expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.be.ok();
          expect(fs.existsSync(dir + '/lib/linked-dir/absolutely-linked-dir/file')).to.not.be.ok();
        });
      } finally {
        try {
          rimraf.sync(targetDir);
        } catch(e) { }
      }
    })
  });


  describe('accepts an single path to be removed', function() {
    it('deletes all paths provided', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = removeFile(sourcePath, {
        path: '/some-dir'
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.be.ok();
        expect(fs.existsSync(dir + '/linked-dir')).to.be.ok();
        expect(fs.existsSync(dir + '/lib/linked-dir/file')).to.be.ok();
        expect(fs.existsSync(dir + '/some-dir/test.txt')).to.not.be.ok();
      });
    })
  });
});
