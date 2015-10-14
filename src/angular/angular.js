import componentTranslator from './translators/component';
import controllerTranslator from './translators/controller';
import routeTranslator from './translators/route';

import Component from './component';
import Controller from './controller';
import Route from './route';

let _module = Symbol('angular-module');
let _config = Symbol('valent-config');

export default class Angular {
  component = Component;
  controller = Controller;
  route = Route;

  translate = {
    component: (component) => {
      let translated = componentTranslator(component);
      let module = translated.module || this[_module];

      angular.module(module)
        .directive(translated.name, translated.configuration);
    },

    controller: (controller) => {
      let translated = controllerTranslator(controller);
      let module = translated.module || this[_module];

      angular.module(module)
        .controller(translated.name, translated.configuration.controller);
    },

    route: (route) => {
      let translated = routeTranslator(route);
      let module = translated.module || this[_module];

      angular.module(module)
        .config(['$routeProvider', ($routeProvider) => {

          for (let url of translated.configuration.routes) {

            $routeProvider.when(url, {
              controller: '',
              template : {},
              resolve: {}
            });
          }
        }]);
    }
  };

  constructor(config, options = {}) {
    if (!options.module) {
      throw new Error('Angular module should be defined');
    }

    this.debug = options.debug || false;

    this[_config] = config;
    this[_module] = options.module;
  }

  bootstrap(options = {}) {
    // initialize injector

    // initialize exception handler

    // initialize route events
  }
}
