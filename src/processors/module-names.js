"use strict";


var ModuleNames = function(source, config) {

  var src = config.getSrcDir(),
      output = config.getDist(),
      root = config.getRoot();

  var argumentsStr = "'" + src + "', '" + output + "', '" + root + "'",
      replacement = '$1.path(__moduleName, ' + argumentsStr + ')';


  var expr = /(Directive\((?:'|")[^\)]+(?:'|")\))/gm;
  source = source.replace(expr, replacement);

  expr = /(Controller\((?:'|")[^\)]+(?:'|")\))/gm;
  source = source.replace(expr, replacement);

  return source;
};

module.exports = ModuleNames;
