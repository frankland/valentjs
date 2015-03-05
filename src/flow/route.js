import Config from '../components/config';

class RouteModel {
  constructor(name) {
    if (name) {
      this.module = name;
    }

    this.resolve = {};
    this.base = '';
  }
}


export default class RouteFlow {
  constructor(name) {
    this.model = new RouteModel(name);
  }

  at(name) {
    this.model.module = name;
    return this;
  }

  hasModule() {
    return !!this.model.module;
  }

  url(url) {
    this.model.url = url;
    this.urlBuilder(url);

    return this;
  }

  urlBuilder(builder) {
    this.model.urlBuilder = builder;

    return this;
  }


  base(url) {
    this.model.base = url;
  }

  resolve(key, expr) {
    this.model.resolve[key] = expr;

    return this;
  }

  controller(controller) {
    this.model.controller = controller;

    return this;
  }

  template(template) {
    this.model.template = template;

    return this;
  }

  templateUrl(templateUrl) {
    this.model.templateUrl = templateUrl;

    return this;
  }

  logInfo() {
    var moduleName = this.model.module || Config.getModuleName();
    var group = `${this.model.base + this.model.url} at ${moduleName}`;
    var resolve = Object.keys(this.model.resolve);

    console.groupCollapsed(group);
    console.log(`controller: ${this.model.controller}`);

    if (this.model.templateUrl) {
      console.log(`templateUrl: ${this.model.templateUrl}`);
    } else if (this.model.template) {
      console.log(`template: ${this.model.template.slice(0, 50).replace(/\n|\r|\r\n/mg, '')}...`);
    } else {
      console.log(`template is wrong`);
    }

    if (resolve.length) {
      console.log(`resolve: '${resolve}`);
    }
    console.groupEnd(group);
  }
}
