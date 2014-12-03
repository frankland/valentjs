"use strict";

var read = require('fs').readFileSync,
  readdir = require('fs').readdirSync,
  lstat = require('fs').lstatSync,
  join = require('path').join,
  Boop = require('boop');


var Tree = Boop.extend({
  initialize: function (config) {
    this.config = config;
  },

  get: function (onlyFiles, input) {
    var src = input || this.config.getSrcDir(),
      get = this.get.bind(this);

    var stats = lstat(src),
      tree = [],
      item = {
        path: src
      };

    tree.push(item);

    if (stats.isDirectory()) {

      if (!onlyFiles) {
        item.type = 'dir';
      }

      readdir(src).map(function (child) {
        var children = get(onlyFiles, join(src, child));
        tree = tree.concat(children);
      });
    }

    return tree;
  }
});


module.exports = Tree;
