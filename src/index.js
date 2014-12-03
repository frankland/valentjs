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


var LocalConfig = {
  inject: false
};


var counter = 1;


function compile(Compiler, Deployment, Tree) {
  var n = counter++;

  Messages.start();

  if (LocalConfig.inject){
    Injector.clear(LocalConfig.inject);
  }

  Messages.write('start', {
    n: n
  });

  var onlyFiles = true,
    list = Tree.get(onlyFiles);

  Messages.write('deploy');
  Deployment.run(list);

  Messages.write('compile');
  return Compiler.compile(list).then(function(e) {
    Messages.write('processing');
    Compiler.process();

    Messages.write('finish', {
      n: n
    });
  }).catch(function(e){

    console.log(e);
    if (LocalConfig.inject){
      Injector.add(LocalConfig.inject, e);
    }

    Messages.write('failed', {
      n: n
    });
  }).finally(function(){
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


module.exports = function(src, dist, build) {
  var Config = new ConfigClass(src, dist, build),
    Compiler = new CompilerClass(Config),
    Deployment = new DeploymentClass(Config),
    Tree = new TreeClass(Config);


  setDefaultOptions(Compiler);
  addProcessors(Compiler);
  addDefaultTypes(Deployment);


  return {
    compile: compile.bind(null, Compiler, Deployment, Tree),

    setOptions: Compiler.setOptions.bind(Compiler),
    addProcessor: Compiler.addProcessor.bind(Compiler),

    config: LocalConfig,
    type: Type,
    addType: Deployment.add.bind(Deployment)
  }
};
