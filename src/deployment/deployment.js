"use strict";

var Boop = require('boop'),
    read = require('fs').readFileSync,
    write = require('fs').writeFileSync,
    rename = require('fs').renameSync,
    mkdirp = require('mkdirp').sync,
    rimraf = require('rimraf').sync,
    dirname = require('path').dirname,
    extname = require('path').extname,
    join = require('path').join,
    fs = require('fs'),
    readdir = require('fs').readdirSync,
    exists = require('fs').existsSync;

var Deployment = Boop.extend({
  initialize: function(config) {
    this.config = config;
    this.types = {};
  },

  add: function(Type) {
    this.types[Type.extname] = Type;
  },

  exists: function(type) {
    return this.types.hasOwnProperty(type);
  },

  get: function(type) {
    if (!this.exists(type)) {
      throw new Error('Type ' + type + ' is not registered');
    }

    return this.types[type];
  },

  getExtname: function(file) {
    return extname(file).slice(1);
  },

  getByFile: function(file) {
    var ext = this.getExtname(file);

    return this.get(ext);
  },

  backup: function() {
    var dir = this.config.getDistDir(),
        backupDir = this.config.getBackupDir(),
        items = readdir(dir);

    rimraf(backupDir);

    for (var i = 0, size = items.length; i < size; i++) {
      var item = items[i],
          path = join(dir, item),
          backupPath = join(backupDir, item);

      mkdirp(dirname(backupPath));

      rename(path, backupPath);
    }
  },

  isBackupExists: function() {

  },

  restore: function() {
    this.clean();

    var dir = this.config.getDistDir(),
        backupDir = this.config.getBackupDir();

    if (exists(backupDir)) {
      var items = readdir(backupDir);

      for (var i = 0, size = items.length; i < size; i++) {
        var item = items[i],
            path = join(dir, item),
            backupPath = join(backupDir, item);

        // TODO:
        rename(backupPath, path);
      }
    }
  },

  clean: function() {
    var dir = this.config.getDistDir(),
        items = readdir(dir);

    for (var i = 0, size = items.length; i < size; i++) {
      var item = items[i],
          path = join(dir, item);

      rimraf(path);
    }
  },

  copy: function(ext) {

    var isCopy = false;
    if (this.exists(ext)) {
      var Type = this.get(ext);
      if (Type.copy) {
        isCopy = true;
      }
    }

    return isCopy;
  },

  translate: function(item) {
    var Type = this.getByFile(item),
        source = read(item).toString();

    return Type.translate(source);
  },

  normalize: function(item) {
    var Type = this.getByFile(item);
    return Type.normalize(item);
  },

  process: function(item, source) {
    var Type = this.getByFile(item);

    Type.process(item, source, this.config);
  },

  finish: function() {
    var dist = this.config.getDistDir();
    for (var type in this.types) {
      if (this.types.hasOwnProperty(type)) {
        var instance = this.types[type];

        instance.finish(dist);
      }
    }
  },

  run: function(tree) {

    var src = this.config.getSrcDir(),
        dist = this.config.getDistDir();

    for (var i = 0, size = tree.length; i < size; i++) {
      var item = tree[i].path,
          ext = this.getExtname(item);

      if (this.exists(ext)) {
        var distScript = this.normalize(item),
            source = this.translate(item);

        this.process(item, source);

        if (this.copy(ext)) {
          var file = join('.', dist, distScript.replace(src, '')),
              dir = dirname(file);

          mkdirp(dir);

          write(file, source);
        }
      }
    }

    this.finish();
  }
});


module.exports = Deployment;
