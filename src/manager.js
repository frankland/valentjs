import ControllerConverter from './converters/controller';
import DirectiveConverter from './converters/directive';
import FactoryConverter from './converters/factory';
import RouteConverter from './converters/route';

export default class Manager {
  constructor() {
    this.storage = {
      controller: [],
      factory: [],
      route: [],
      directive: []
    };
  }

  controller(component) {
    this.storage.controller.push(component);
  }

  factory(component) {
    this.storage.factory.push(component);
  }

  route(component) {
    this.storage.route.push(component);
  }

  directive(component) {
    this.storage.directive.push(component);
  }

  statistics() {
    var storage = this.storage;
    var types = Object.keys(storage);

    console.groupCollapsed('Runtime statistics');

    for (var type of types) {
      var total = storage[type].length;

      if (total) {
        var components = storage[type],
            group = `${type}  (${total})`;

        console.group(group);

        for (var component of components) {

          if (angular.isFunction(component.logInfo)) {
            component.logInfo();
          } else {
            console.log(`${component.name} at ${component.module}`);
          }
        }

        console.groupEnd(group);
      }
    }

    console.groupEnd('Runtime statistics');
  }

  registerControllers(moduleName){
    var controllers = this.storage.controller;

    for (var controller of controllers) {
      if (moduleName) {
        controller.at(moduleName);
      }

      ControllerConverter(controller);
    }
  }

  registerDirectives(moduleName){
    var directives = this.storage.directive;

    for (var directive of directives) {
      if (moduleName) {
        directive.at(moduleName);
      }

      DirectiveConverter(directive);
    }
  }

  registerFactories(moduleName){
    var factories = this.storage.factory;

    for (var factory of factories) {
      if (moduleName) {
        factory.at(moduleName);
      }

      FactoryConverter(factory);
    }
  }

  registerRoutes(moduleName){
    var routes = this.storage.route;

    RouteConverter(routes, moduleName);
  }

  register(moduleName) {
    this.registerControllers(moduleName);
    this.registerDirectives(moduleName);
    this.registerFactories(moduleName);
    this.registerRoutes(moduleName);
  }
}
