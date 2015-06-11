import ControllerModel from './controller/controller-model';
import RouteModel from './route/route-model';
import DirectiveModel from './directive/directive-model';
import FactoryModel from './factory/factory-model';

var local = {
  storage: Symbol('storage')
};

class Manager {
  constructor() {
    this.clear();
  }

  addController(contoller) {
    if (!(contoller instanceof ControllerModel)) {
      throw new Error('Wrong controller model instance');
    }

    this[local.storage].controllers.add(contoller);
  }

  removeController(controller) {
    this[local.storage].controllers.remove(controller);
  }

  clearControllers() {
    this[local.storage].controllers.clear();
  }

  // --------------------

  addFactory(factory) {
    if (!(factory instanceof FactoryModel)) {
      throw new Error('Wrong factory model instance');
    }

    this[local.storage].factories.add(factory);
  }

  removeFactory(factory) {
    this[local.storage].factories.remove(factory);
  }

  clearFactories() {
    this[local.storage].factories.clear();
  }

  // --------------------

  addDirective(directive) {
    if (!(directive instanceof DirectiveModel)) {
      throw new Error('Wrong directive model instance');
    }

    this[local.storage].directives.add(directive);
  }

  removeDirective(directive) {
    this[local.storage].directives.remove(directive);
  }

  clearDirectives() {
    this[local.storage].directives.clear();
  }

  // --------------------

  addRoute(route) {
    if (!(route instanceof RouteModel)) {
      throw new Error('Wrong route model instance');
    }

    this[local.storage].routes.add(route);
  }

  removeRoute(route) {
    this[local.storage].routes.remove(route);
  }

  clearRoutes() {
    this[local.storage].routes.clear();
  }

  getModels() {
    return this[local.storage];
  }

  clear() {
    this[local.storage] = {};

    /**
     * Better to se WeakSet storage but polyfill for WeakSet is not iterable
     */
    this[local.storage].controllers = new Set();
    this[local.storage].factories = new Set();
    this[local.storage].directives = new Set();
    this[local.storage].routes = new Set();
  }
}


export default new Manager();
export { Manager };
