class Route {

  constructor(name) {

    this.module = name;
    this.config = {};

    this.config.base = '';
    this.config.resolve = {};
  }

  url(url) {
    this.config.url = url;

    if (!this.config.hasOwnProperty('buildUrl')) {
      this.buildUrl(url);
    }

    return this;
  }

  base(url) {
    this.config.base = url;
  }

  resolve(key, expr) {
    this.config.resolve[key] = expr;

    return this;
  }

  controller(controller) {
    this.config.controller = controller;

    return this;
  }

  templateUrl(templateUrl) {
    this.config.templateUrl = templateUrl;

    return this;
  }

  template(template) {
    this.config.template = template;

    return this;
  }

  buildUrl(builder) {
    this.config.buildUrl = builder;

    return this;
  }

  logInfo() {

    var group = `${this.config.base + this.config.url}`;
    var resolve = Object.keys(this.config.resolve);


    console.groupCollapsed(group);
    console.log(`controller: ${this.config.controller}`);

    if (this.config.templateUrl) {
      console.log(`templateUrl: ${this.config.templateUrl}`);
    } else if (this.config.template) {
      console.log(`template: ${this.config.template.slice(0, 50).replace(/\n|\r|\r\n/mg, '')}`);
    } else {
      console.log(`template is wrong`);
    }

    if (resolve.length) {
      console.log(`resolve: '${resolve}`);
    }
    console.groupEnd(group);
  }
}

export default Route;
