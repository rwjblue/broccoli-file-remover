var fs = require('fs');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');
var helpers = require('broccoli-kitchen-sink-helpers')
var rimraf = require('rimraf');

Remover.prototype = Object.create(CachingWriter.prototype);
Remover.prototype.constructor = Remover;
function Remover (inputTree, options) {
  if (!(this instanceof Remover)) return new Remover(inputTree, options);

  options = options || {};
  this.inputTree = inputTree;

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key]
    }
  }
};

Remover.prototype._remove = function (directory, source) {
  rimraf.sync(path.join(directory, source));
};

Remover.prototype.updateCache = function (srcDir, destDir) {
  var self = this

  helpers.copyRecursivelySync(srcDir, destDir);

  var many   = self.files || self.paths;
  var single = self.srcFile || self.path;

  if (many) {
    many.forEach(function(file) {
      self._remove(destDir, file);
    });
  } else {
    self._remove(destDir, single);
  }
};

module.exports = Remover;
