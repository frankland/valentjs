"use strict";

var Boop = require('boop'),
  read = require('fs').readFileSync,
  write = require('fs').writeFileSync,
  mkdirp = require('mkdirp'),
  rimraf = require('rimraf').sync,
  dirname = require('path').dirname,
  extname = require('path').extname,
  join = require('path').join;

var Deployment = Boop.extend({
  initialize: function (config) {
    this.config = config;
    this.types = {};
  },

  add: function (Type) {
    this.types[Type.extname] = Type;
  },

  exists: function (type) {
    return this.types.hasOwnProperty(type);
  },

  get: function (type) {
    if (!this.exists(type)) {
      throw new Error('Type ' + type + ' is not registered');
    }

    return this.types[type];
  },

  getExtname: function (file) {
    return extname(file).slice(1);
  },

  getByFile: function (file) {
    var ext = this.getExtname(file);

    return this.get(ext);
  },

  copy: function (item) {
    var ext = this.getExtname(item),
      isCopy = false;

    if (this.exists(ext)) {
      var Type = this.get(ext);
      if (Type.copy) {
        isCopy = true;
      }
    }

    return isCopy;
  },

  translate: function (item) {
    var Type = this.getByFile(item),
      source = read(item).toString();

    return Type.translate(source);
  },

  normalize: function (item) {
    var Type = this.getByFile(item);
    return Type.normalize(item);
  },

  process: function (item) {
    var Type = this.getByFile(item),
      source = read(item).toString();

    Type.process(item, source);
  },

  clear: function(){
    var dist = this.config.getDistDir();

    rimraf(dist);
  },

  run: function (tree) {
    this.clear();

    var src = this.config.getSrcDir(),
      dist = this.config.getDistDir();

    for (var i = 0, size = tree.length; i < size; i++) {
      var item = tree[i].path;


      if (this.copy(item)) {
        var distScript = this.normalize(item),
          source = this.translate(item);

        this.process(item, source);

        var file = join('.', dist, distScript.replace(src, '')),
          dir = dirname(file);

        mkdirp.sync(dir);

        write(file, source);
      }
    }
  }
});


module.exports = Deployment;
