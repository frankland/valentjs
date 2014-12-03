"use strict";


var Type = require('./type'),
  Html = Type.extend({
    extname: 'html',

    initialize: function () {
      this.copy = true;
    }
  });


module.exports = Html;
