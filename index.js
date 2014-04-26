var fs = require('fs');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

Remover.prototype = Object.create(CachingWriter.prototype);
Remover.prototype.constructor = Remover;
function Remover (inputTree, options) {
  if (!(this instanceof Remover)) return new Remover(inputTree, options);

  this.inputTree = inputTree;
  this.files     = options.files;
  this.srcFile   = options.srcFile;
};

Remover.prototype._removeFile = function (directory, source) {
  fs.unlinkSync(path.join(directory, source));
};

Remover.prototype.updateCache = function (srcDir, destDir) {
  var self = this

  helpers.copyRecursivelySync(srcDir, destDir);

  if (Array.isArray(self.files)) {
    self.files.forEach(function(file) {
      self._removeFile(destDir, file);
    });
  } else {
    self._removeFile(destDir, self.srcFile);
  }
};

module.exports = Remover;
