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
     * NOTE: add organized validation for all components, controllers and routes before translation?
     */

    // --- TRANSLATE COMPONENTS(DIRECTIVES)
    try {
      let FrameworkComponentClass = this[_framework].component;

      for (let component of this[_components]) {
        let frameworkComponent = new FrameworkComponentClass(component.name, component.controller, component.options);
        this[_framework].translate.component(frameworkComponent, this.config);
      }
    } catch (error) {
      throw new Error(`could not register components. ${error.message}`);
    }


    // --- TRANSLATE CONTROLLERS
    try {
      let FrameworkControllerClass = this[_framework].controller;

      for (let controller of this[_controllers]) {
        let frameworkController = new FrameworkControllerClass(controller.name, controller.controller, controller.options);
        this[_framework].translate.controller(frameworkController, this.config);
      }
    } catch (error) {
      throw new Error(`could not register controllers. ${error.message}`);
    }

    // --- TRANSLATE ROUTING
    try {
      let FrameworkRouteClass = this[_framework].route;

      for (let route of this[_routes]) {
        let frameworkRoute = new FrameworkRouteClass(route.name, route.url, route.options);
        this[_framework].translate.route(frameworkRoute, this.config);
      }
    } catch (error) {
      throw new Error(`could not register routes. ${error.message}`);
    }

    this[_framework].bootstrap(this.config);

    this[_bootstrap] = true;
  }

  component(name, Component, options) {
    if (this[_bootstrap]) {
      throw new Error('component could no be registered after bootstrap');
    }

    this[_components].add({
      name,
      controller: Component,
      options
    });
  }

  controller(name, Controller, options) {
    if (this[_bootstrap]) {
      throw new Error('controller could no be registered after bootstrap');
    }

    this[_controllers].add({
      name,
      controller: Controller,
      options
    });
  }

  route(name, url, options) {
    if (this[_bootstrap]) {
      throw new Error('route could no be registered after bootstrap');
      ;
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
