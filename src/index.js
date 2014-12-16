"use strict";

var DeploymentClass = require('./deployment/deployment'),
    Type = require('./deployment/types/type'),
    Html = require('./deployment/types/html'),
    CompilerClass = require('./compiler'),
    ConfigClass = require('./config'),
    ModuleNames = require('./processors/module-names'),
    TreeClass = require('./tree'),
    Messages = require('./messages'),
    Injector = require('./inject');



var counter = 1;



function compile(Config, Compiler, Deployment, Tree) {
  var n = counter++,
      start = new Date(),
      index = Config.getIndexHtml();

  Messages.start();

  if (index) {
    Injector.clear(index);
  }

  Messages.write('start', {
    n: n
  });

  var onlyFiles = true,
      list = Tree.get(onlyFiles);

  Messages.write('compile');

  Messages.write('clean');
  Deployment.clean();

  return Compiler.compile(list).then(function(e) {

    Messages.write('deploy');
    Deployment.run(list);

    Messages.write('processing');
    var processed = Compiler.process();

    Compiler.save(processed);

    Messages.write('finish', {
      n: n,
      elapsed: (new Date() - start) / 1000
    });

    //Messages.write('backup');
    //Deployment.backup();
  }).catch(function(e) {

    //Messages.write('restore');
    //Deployment.restore();

    if (index) {
      Injector.add(index, e);
    }

    Messages.write('failed', {
      n: n
    });

    console.log(e);
  }).finally(function() {
    Messages.end();
  });
}

function setDefaultOptions(Compiler) {

  Compiler.setOptions({
    sourceMaps: true,
    types: true
  });
}

function addProcessors(Compiler) {
  Compiler.addProcessor(ModuleNames);
}

function addDefaultTypes(Deployment) {
  Deployment.add(new Html());
}


module.exports = function(options) {

  var Config = new ConfigClass(options),
      Compiler = new CompilerClass(Config),
      Deployment = new DeploymentClass(Config),
      Tree = new TreeClass(Config);


  setDefaultOptions(Compiler);
  addProcessors(Compiler);
  addDefaultTypes(Deployment);


  return {
    compile: compile.bind(null, Config, Compiler, Deployment, Tree),

    setOptions: Compiler.setOptions.bind(Compiler),
    addProcessor: Compiler.addProcessor.bind(Compiler),

    config: Config,
    //config: LocalConfig,
    type: Type,
    addType: Deployment.add.bind(Deployment)
  }
};
