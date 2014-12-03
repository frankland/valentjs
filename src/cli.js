'use strict';

var program = require('commander'),
    enchup = require('enchup'),
    Chalk = require('chalk'),
    config = require('../package.json'),
    ngx = require('./index');


var Config = enchup.getConfig();

Config.repository.init = 'tuchk4/angular-ngx';

function setup() {
  program
      .usage('ngx [command]');

  program
      .version(config.version);

  program
      .command('setup [repository]')
      .option('-f, --force', 'Clear directory if it is not empty')
      .description('Setup enchup config and templates')
      .action(enchup.setup);

  program
      .command('init [repository]')
      .description('Initialize application')
      .action(enchup.init);

  program
      .command('info [component]')
      .description('Show enchup info accroding to current structure')
      .action(enchup.info);

  program
      .command('create <component> <parameters> [template]')
      .option('-f, --force', 'cverride if already exists')
      .option('-c, --continue', 'do not ovveride existing components if multiple')
      .description('Create components according to structure. <parameters> - :component..:component')
      .action(enchup.create);

  program
      .command('compile <src-dir> <dist-dir> <dist-script>')
      .description('Compile and deploy source dir to dist. System.map will not work in this way')
      .action(compile);
}

var available = ['setup', 'init', 'info', 'create', 'compile', '-V', '--version'];

function compile(src, dist, script) {
  console.log('');
  console.log(Chalk.red('ngx.cli.compile'));
  console.log('This will not work correctly now because you can not setup System.map. Use node API to compile sources.')
  console.log('');

  var Instance = ngx(src, dist, script);

  Instance.compile();
}

module.exports = {

  run: function() {

    var command;

    if (process.argv[0] == 'node') {
      command = process.argv[2];
    } else {
      command = process.argv[1];
    }

    setup();

    if (available.indexOf(command) !== -1) {
      program.parse(process.argv);
    } else {
      program.help();
    }
  }
};
