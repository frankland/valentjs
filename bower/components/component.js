class Component {

  constructor(name) {
    if (name){
      this.name = name;
    }

    this.config = {};

    this.config.dependencies = [];
    this.config.defaults = {};
  }

  at(name){
    this.module = name;
    return this;
  }

  defaults(defaults) {
    this.config.defaults = defaults;
    return this;
  }

  dependencies(dependencies) {
    if (!Array.isArray(dependencies)){
      dependencies = [dependencies];
    }

    this.config.dependencies = this.config.dependencies.concat(dependencies);
    return this;
  }

  statistics(){

  }

  compile(){

  }

  path(modulePath, baseDir, buildScript){
    this.modulePath = modulePath;
    this.baseDir = baseDir;
    this.buildScript = buildScript;

    return this;
  }
}


export default Component;
