"use strict";


var ModuleNames = function(source, config) {

  var src = config.getSrcDir(),
    dist = config.getDist();

  var expr = /(Directive\((?:'|")[^\)]+(?:'|")\))/gm;
  source = source.replace(expr, '$1.path(__moduleName, \'' + src +
    '\', \'' + dist + '\')');

  expr = /(Controller\((?:'|")[^\)]+(?:'|")\))/gm;
  source = source.replace(expr, '$1.path(__moduleName, \'' + src +
    '\', \'' + dist + '\')');

  return source;
};

module.exports = ModuleNames;
