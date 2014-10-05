var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var symlinkOrCopy = require('symlink-or-copy');

Remover.prototype = Object.create(Writer.prototype);
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

Remover.prototype._linkDeeply = function _linkDeeply(source, destination) {
  var entries = walkSync(source);

  for (var i = 0, l = entries.length; i < l; i++) {
    var relativePath = entries[i];

    if (relativePath[relativePath.length - 1] === '/') {
      mkdirp.sync(destination + '/' + relativePath)
    } else {
      var linkPath = source + '/' + relativePath;
      var stats = fs.lstatSync(linkPath);

      if (stats.isSymbolicLink()) {
        linkPath = fs.readlinkSync(linkPath);
      }

      symlinkOrCopy.sync(path.resolve(process.cwd(), linkPath), destination + '/' + relativePath)
    }
  }
};

Remover.prototype._remove = function (directory, source) {
  rimraf.sync(path.join(directory, source));
};

Remover.prototype.write = function (readTree, destDir) {
  var self = this

  return readTree(this.inputTree).then(function(srcDir) {
    self._linkDeeply(srcDir, destDir);

    var many   = self.files || self.paths;
    var single = self.srcFile || self.path;

    if (many) {
      many.forEach(function(file) {
        self._remove(destDir, file);
      });
    } else {
      self._remove(destDir, single);
    }
  });
};

module.exports = Remover;
