"use strict";

var write = require('fs').writeFileSync,
    join = require('path').join;

function jsEscape(content) {
  return content.replace(/(['\\])/g, '\\$1')
      .replace(/[\f]/g, "\\f")
      .replace(/[\b]/g, "\\b")
      .replace(/[\n]/g, "\\n")
      .replace(/[\t]/g, "\\t")
      .replace(/[\r]/g, "\\r")
      .replace(/[\u2028]/g, "\\u2028")
      .replace(/[\u2029]/g, "\\u2029");
}


var Type = require('./type'),
    Html = Type.extend({
      extname: 'html',

      initialize: function() {
        this.copy = true;
        this.cache = {};
      },

      process: function(path, source, config) {

        var dist = config.getDistDir(),
            src = config.getSrcDir(),
            root = config.getRoot();

        var escaped = JSON.stringify(source);

        path = path.replace(src, dist).replace(root, '');

        this.cache[path] = escaped;
      },

      finish: function(dist) {
        var cache = "angular.module('app').run(function($templateCache) {";

        for (var path in this.cache) {
          if (this.cache.hasOwnProperty(path)) {
            cache += " $templateCache.put('" + path + "', " + this.cache[path] + "); ";
          }
        }

        cache += '});';


        var file = join(dist, 'template-cache.js');
        write(file, cache);
      }
    });


module.exports = Html;
