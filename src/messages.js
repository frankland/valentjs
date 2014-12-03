"use strict";
var Chalk = require('chalk');

var Logger = {
  items: {
    start: Chalk.green('Build #') + '{n}' + Chalk.green(' started.'),
    finish: Chalk.green('Build #') + '{n}'
        + Chalk.green(' finished. Elapsed time: ')
        + '{elapsed}' + Chalk.green('ms'),
    deploy: Chalk.blue('... deploy'),
    compile: Chalk.blue('... compiling'),
    processing: Chalk.blue('... processing'),
    failed: Chalk.red('Build #') + '{n}' + Chalk.red(' failed.')
  },

  start: function() {
    console.log('');
    console.log(Chalk.blue('+---------------------'));
  },

  end: function() {
    console.log(Chalk.yellow('+---------------------'));
    console.log('');
  },

  compile: function(key, params) {
    var str = this.items[key] || 'Message is not defined for "' + key + '"';

    for (var item in params) {
      if (params.hasOwnProperty(item)) {
        var expr = new RegExp('\\{\\s*' + item + '\\s*\\}', 'g')
        str = str.replace(expr, params[item]);
      }
    }

    return str;
  },

  write: function(key, params) {
    var compiled = this.compile(key, params);

    console.log('| ' + compiled);
  }
};


module.exports = Logger;
