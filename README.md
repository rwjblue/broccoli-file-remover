# Broccoli's File Remover

[![Build Status](https://travis-ci.org/rjackson/broccoli-file-remover.svg?branch=master)](https://travis-ci.org/rjackson/broccoli-file-remover)

## Installation

```bash
npm install --save-dev broccoli-file-remover
```

## Usage

### Files

Removing a single file from `app/main`:

```javascript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  srcFile: 'app/main.js'
});
```

Removing `app/main` and `test/main`:

```javacript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  files: ['app/main.js', 'test/main.js']
});
```

### Directories

Removing a directory (`tests/dummy`):

```javascript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  path: 'tests/dummy'
});
```

Removing a number of directories:

```javascript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  paths: ['directory1', 'directory2']
});
```

## Documentation

### `removeFile(inputTree, options)`

---

`options.srcFile` *{String}* (also aliased as `options.path`)

The path of the file to remove.

---

`options.files` *{Array}* (also aliased as `options.paths`)

This allows specifying more than one remove operation at a time (and reduced the total number of trees/steps
needed if you need to move many files or directories). Each file listed in the array will be removed.

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
