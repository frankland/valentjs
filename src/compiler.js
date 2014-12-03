"use strict";


var Traceur = require('traceur'),
    Boop = require('boop'),
    read = require('fs').readFileSync,
    write = require('fs').writeFileSync,
    extname = require('path').extname;


var compile = Traceur.recursiveModuleCompileToSingleFile.bind(Traceur);

function build(dist, sources, options) {

  return compile(dist, sources, options);
}

function getScripts(tree) {
  var sources = [];
  for (var i = 0, size = tree.length; i < size; i++) {
    var item = tree[i];

    var ext = extname(item.path);

    if (ext == '.js') {
      sources.push({
        name: item.path.replace(ext, ''),
        type: 'module'
      });
    }
  }

  return sources;
}

var Compiler = Boop.extend({
  initialize: function(config) {

    this.config = config;

    this.processors = [];

    this.options = new Traceur.util.CommandOptions();
  },

  setOptions: function(options) {

    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        this.options[option] = options[option];
      }
    }
  },

  compile: function(tree) {

    var dist = this.config.getDist(),
        sources = getScripts(tree),
        options = this.options;

    return build(dist, sources, options);
  },

  getSource: function() {
    var dist = this.config.getDist();

    return read(dist).toString();
  },

  process: function() {
    var source = this.getSource(),
        config = this.config;

    for (var i = 0; i < this.processors.length; i++) {
      var processor = this.processors[i];
      source = processor(source, config);
    }

    return source;
  },

  addProcessor: function(processor) {
    this.processors.push(processor);
  },

  save: function(source) {
    var dist = this.config.getDist();

    write(dist, source);
  }
});


module.exports = Compiler;
