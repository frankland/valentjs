import Config from '../components/config';

class ControllerModel {
  constructor(name) {
    if (name) {
      this.name = name;
    }

    this.dependencies = [];
  }

  hasRoute() {
    return this.hasOwnProperty('route');
  }
}

export default class ControllerFlow  {

  constructor(name) {
    this.model = new ControllerModel(name);
  }

  at(name) {
    this.model.module = name;

    if (this.model.hasRoute()) {
      this.model.route.at(name);
    }

    return this;
  }

  hasModule() {
    return !!this.model.module;
  }

  dependencies(dependencies) {
    if (!Array.isArray(dependencies)) {
      dependencies = [dependencies];
    }

    this.model.dependencies = this.model.dependencies.concat(dependencies);
    return this;
  }

  /**
   * Route flow
   */
  router(routeInstance) {
    this.model.route = routeInstance;
    return this;
  }

  resolve() {
    if (!this.model.hasRoute()) {
      throw new Error('Router is not defined or is not allowed');
    }

    var resolve = arguments[0];
    if (arguments.length == 2) {
      resolve = {};
      resolve[arguments[0]] = arguments[1];
    }

    for (var key of Object.keys(resolve)) {
      this.model.route.resolve(key, resolve[key]);
      this.dependencies(key);
    }

    return this;
  }


  route(url) {
    if (!this.model.hasRoute()) {
      throw new Error('Router is not defined or is not allowed');
    }

    this.model.route.url(url);

    return this;
  }

  template(template){
    if (!this.model.hasRoute()) {
      throw new Error('Router is not defined or is not allowed');
    }

    this.model.route.template(template);

    return this;
  }

  templateUrl(templateUrl){
    if (!this.model.hasRoute()) {
      throw new Error('Router is not defined or is not allowed');
    }

    this.model.route.templateUrl(templateUrl);

    return this;
  }

  urlBuilder(builder) {
    if (!this.model.hasRoute()) {
      throw new Error('Router is not defined or is not allowed');
    }

    this.model.route.urlBuilder(builder);

    return this;
  }

  /**
   * Controller flow
   */
  src(src) {
    this.model.src = src;
    return this;
  }

  logInfo() {
    var moduleName = this.model.module || Config.getModuleName();
    var group = `${this.model.name} at ${moduleName}`;

    console.groupCollapsed(group);

    if (!!Object.keys(this.model.dependencies).length) {
      console.log(`dependecies:`, this.model.dependencies);
    }

    console.groupEnd(group);
  }
}

