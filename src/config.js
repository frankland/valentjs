"use strict";

var Boop = require('boop'),
    join = require('path').join;

var Config = Boop.extend({
  initialize: function(options) {
    this.src = options.src;
    this.dist = options.dist;
    this.output = options.output;
    this.root = options.root;
  },

  getSrcDir: function() {
    return this.src;
  },

  getDist: function() {
    return join(this.dist, this.output);
  },

  getDistDir: function() {
    return this.dist;
  },

  getOutput: function() {
    return this.output;
  },

  getRoot: function() {
    return this.root;
  }
});


module.exports = Config;
