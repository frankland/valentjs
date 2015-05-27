import ControllerConverter from './angular/converters/controller-converter';
import FactoryConverter from './angular/converters/factory-converter';
import DirectiveConverter from './angular/converters/directive-converter';
import RouteConverter from './angular/converters/route-converter';


import ControllerModel from './controller/controller-model';
import RouteModel from './route/route-model';
import DirectiveModel from './directive/directive-model';
import FactoryModel from './factory/factory-model';

var storage = Symbol('storage');

class Manager {
  constructor() {
    this[storage] = {};

    /**
     * Better to se WeakSet storage but polyfill for WeakSet is not iterable
     */
    this[storage].controllers = new Set();
    this[storage].factories = new Set();
    this[storage].directives = new Set();
    this[storage].routes = new Set();
  }

  addController(contoller) {
    if (!(contoller instanceof ControllerModel)) {
      throw new Error('Wrong controller model instance');
    }

    this[storage].controllers.add(contoller);
  }

  removeController(controller) {
    this[storage].controllers.remove(controller);
  }

  clearControllers() {
    this[storage].controllers.clear();
  }

  // --------------------

  addFactory(factory) {
    if (!(factory instanceof FactoryModel)) {
      throw new Error('Wrong factory model instance');
    }

    this[storage].fatories.add(factory);
  }

  removeFactory(factory) {
    this[storage].factories.remove(factory);
  }

  clearFactories() {
    this[storage].factories.clear();
  }

  // --------------------

  addDirective(directive) {
    if (!(directive instanceof DirectiveModel)) {
      throw new Error('Wrong directive model instance');
    }

    this[storage].directives.add(directive);
  }

  removeDirective(directive) {
    this[storage].directives.remove(directive);
  }

  clearDirectives() {
    this[storage].directives.clear();
  }

  // --------------------

  addRoute(route) {
    if (!(route instanceof RouteModel)) {
      throw new Error('Wrong route model instance');
    }

    this[storage].routes.add(route);
  }

  removeRoute(route) {
    this[storage].routes.remove(route);
  }

  clearRoutes() {
    this[storage].routes.clear();
  }

  register() {
    var controllers = this[storage].controllers;
    var factories = this[storage].factories;
    var directives = this[storage].directives;
    var routes = this[storage].routes;

    ControllerConverter.register(controllers);
    FactoryConverter.register(factories);
    DirectiveConverter.register(directives);

    RouteConverter.setup();
    RouteConverter.register(routes);
  }
}


export default new Manager();
export { Manager };
