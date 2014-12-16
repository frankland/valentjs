"use strict";

var Boop = require('boop'),
    join = require('path').join;

var Config = Boop.extend({
  initialize: function(options) {
    this.src = options.src;
    this.dist = options.dist;
    this.output = options.output;
    this.root = options.root;

    this.inject = false;
  },

  getBackupDir: function(){
    return 'build-backup';
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
  },

  setIndexHtml: function(index) {
    this.index = index;
  },

  getIndexHtml: function() {
    return this.index || false;
  }
});


module.exports = Config;
