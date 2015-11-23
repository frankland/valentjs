import RegisterException from './exceptions/register';
import ApplicationConfig from './application-config';


let _controllers = Symbol('controllers');
let _components = Symbol('components');
let _routes = Symbol('routes');
let _framework = Symbol('framework');
let _bootstrap = Symbol('bootstrap');

class Valent {
  version = '0.1.0';

  config = new ApplicationConfig({
    version: this.version
  });

  constructor() {
    this[_bootstrap] = false;

    this[_controllers] = new Set();
    this[_components] = new Set();
    this[_routes] = new Set();
  }

  bootstrap(framework) {
    this[_framework] = framework;
    this.url = this[_framework].getUrlManager();

    /**
     * NOTE: add organized validation for all components, controllers and routes
     * before registration?
     */
    try {
      for (let component of this[_components]) {
        let frameworkComponent = new this[_framework].component(component.name, component.controller, component.options);
        this[_framework].translate.component(frameworkComponent, this.config);
      }
    } catch (error) {
      throw new Error(`could not register components. ${error.message}`);
    }

    //try {
    for (let controller of this[_controllers]) {
      let frameworkController = new this[_framework].controller(controller.name, controller.controller, controller.options);
      this[_framework].translate.controller(frameworkController, this.config);
    }
    //} catch (error) {
    //  throw new Error(`could not register controllers. ${error.message}`);
    //}

    //try {
    for (let route of this[_routes]) {
      let frameworkRoute = new this[_framework].route(route.name, route.url, route.options);
      this[_framework].translate.route(frameworkRoute, this.config);
    }
    //} catch (error) {
    //  throw new Error(`could not register routes. ${error.message}`);
    //}

    this[_framework].bootstrap(this.config);

    this[_bootstrap] = true;
  }

  component(name, Component, options) {
    if (this[_bootstrap]) {
      throw new Error('todo');
    }

    this[_components].add({
      name,
      controller: Component,
      options
    });
  }

  controller(name, Controller, options) {
    if (this[_bootstrap]) {
      throw new Error('todo');
    }

    this[_controllers].add({
      name,
      controller: Controller,
      options
    });
  }

  route(name, url, options) {
    if (this[_bootstrap]) {
      throw new Error('todo');
    }

    this[_routes].add({
      name,
      url,
      options
    });
  }
}


let valent = null;
let context = typeof window !== 'undefined' ? window : global;

if (context.valent) {
  throw new Error('Seems there are multiple installations of Valent');
} else {
  context.valent = new Valent();
}
