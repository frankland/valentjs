"use strict";


var Boop = require('boop'),
  Type = Boop.extend({
    initialize: function () {
      this.copy = false;
    },

    translate: function (source) {
      return source;
    },

    process: function () {

    },

    normalize: function (name) {
      return name;
    }
  });

module.exports = Type;
