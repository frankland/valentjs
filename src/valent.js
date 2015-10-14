import Angular from 'angular/angular';

import ValentComponent from './component';

var valent = null;
var context = typeof window !== 'undefined' ? window : global;

if (context.valent) {
  throw new Error('Seems there are multiple installations of Valent');
} else {
  context.valent = {
    bootstrap: (framework, options = {}) => {
      context.valent = new Valent(framework, options);
    }
  };
}

class RegisterException extends Error {
  constructor(type, name, errors) {
    this.message = `Could not register "${type}" - "${name}".`;

    for (let error of errors) {
      this.message += "\n - " + error;
    }

    this.message += "\n";
  }
}


let wrappers = {
  angular: Angular
};

let _controllers = Symbol('controllers');
let _components = Symbol('components');
let _routes = Symbol('routes');
let _framework = Symbol('framework');
let _urls = Symbol('urls');

export default class Valent {
  version = '0.1.0';

  config = new ApplicationConfig({
    version: this.version
  });

  constructor() {
    this[_controllers] = new Set();
    this[_components] = new Set();
    this[_routes] = new Set();
  }

  bootstrap(framework, options) {
    let wrapper = wrappers[framework];
    this[_framework] = new wrapper(this.config, options);

    this[_framework].bootstrap(options);

    /**
     * NOTE: add organized validation for all components, controllers and routes
     * before registration?
     */
    try {
      for (let valentComponent of this[_components]) {
        let frameworkComponent = new this[_framework].component(valentComponent);
        this[_framework].register.component(frameworkComponent);
      }
    } catch (error) {
      throw new Error(`could not register components for "${framework}"`)
    }
  }

  component(name, Component, options) {
    try {
      var valentComponent = new ValentComponent(name, Component, options);
    } catch (error) {
      throw new RegisterException('component', error.name, error.messages);
    }

    this[_components].set(valentComponent);
  }

  controller(name, controller, options) {

  }

  route(controller, options) {

  }

  url(namespace) {
    return this[_urls].get(namespace);
  }
}
