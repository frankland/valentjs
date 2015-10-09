import componentTranslator from './translators/component';

import Component from './component';
import Controller from './controller';
import Route from './route';

let _module = Symbol('angular-module');

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

      if (this.debug) {
        console.log(`registered component "${translated.name}"`);
      }
    },

    controller: () => {

    },

    route: () => {

    }
  };

  constructor(options) {
    this.debug = options.debug || false;

    this[_module] = options.module;
  }
}
