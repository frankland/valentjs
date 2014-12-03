"use strict";

var Boop = require('boop'),
    read = require('fs').readFileSync,
    write = require('fs').writeFileSync,
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf').sync,
    dirname = require('path').dirname,
    extname = require('path').extname,
    join = require('path').join,
    readdir = require('fs').readdirSync;

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

  clear: function() {
    var dist = this.config.getDistDir();

    var list = readdir(dist),
        output = this.config.getOutput(),
        sourceMaps = output.replace(/\.js$/, '.map');

    for (var i = 0, size = list.length; i < size; i++) {
      var item = list[i];

      if (item != output && item != sourceMaps) {
        var path = join(dist, item);
        rimraf(path);
      }
    }
  },
  
  finish: function(){
    var dist = this.config.getDistDir();
    for (var type in this.types) {
      if (this.types.hasOwnProperty(type)) {
        var instance = this.types[type];

        instance.finish(dist);
      }
    }
  },

  run: function(tree) {
    this.clear();

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

          mkdirp.sync(dir);

          write(file, source);
        }
      }
    }

    this.finish();
  }
});


module.exports = Deployment;
