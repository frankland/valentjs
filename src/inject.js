"use strict";
var read = require('fs').readFileSync,
  write = require('fs').writeFileSync,
  join = require('path').join;
//p = require('process');


var path = join(__dirname, 'inject', 'script.js'),
  Script = read(path).toString();



var getSource = function (file) {
  var path = join('./', file);

  return read(path).toString();
}

var Inject = function (file, errors) {
  var str = '[]';

  if (!!errors.length) {
    str = JSON.stringify(errors).replace(/\'/g, '\\\'')
  }


  var InjectErrors = Script.replace('BuildErrors', str),
    InjectWrapper = '<script data-inject="build-errors">' + InjectErrors + '</script>';

  Write(file, InjectWrapper);
}

var Clear = function (file) {
  Write(file, '');
}

var Write = function (file, inject) {
  var source = getSource(file),
    expr = new RegExp('<script\\s+data\\-inject=\"build\\-errors\"[^\\>]*>([\\s\\S]*)<\/script>', 'gmi'),
    isAlreadyInjected = expr.test(source);

  if (!isAlreadyInjected) {
    expr = '</body>';
    inject = inject + "\n" + '</body>';
  }

  var injected = source.replace(expr, inject);

  write(file, injected);
}

module.exports = {
  add: Inject,
  clear: Clear
};
