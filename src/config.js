"use strict";

var Boop = require('boop'),
  join = require('path').join;

var Config = Boop.extend({
  initialize: function(src, dist, build) {
    this.src = src;
    this.dist = dist;
    this.build = build;
  },

  getSrcDir: function() {
    return this.src;
  },

  getDist: function() {
    return join(this.dist, this.build);
  },

  getDistDir: function() {
    return this.dist;
  }
});


module.exports = Config;
