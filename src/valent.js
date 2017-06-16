import ApplicationConfig from './application-config';
import RegisterException from './exceptions/register';

let _controllers = Symbol('controllers');
let _components = Symbol('components');
let _routes = Symbol('routes');
let _framework = Symbol('framework');
let _bootstrap = Symbol('bootstrap');

const translateComponents = (framework, components, config) => {
  let isDevEnvironment = config.get('valent.environment.dev', true);
  let FrameworkComponentClass = framework.component;

  for (let component of components) {
    let args = [component.name, component.controller, component.options];

    if (isDevEnvironment) {
      let errors = FrameworkComponentClass.validate(...args);

      if (errors.length) {
        throw new RegisterException(component.name, 'valent-component', errors);
      }
    }

    let frameworkComponent = new FrameworkComponentClass(...args);
    framework.translate.component(frameworkComponent, config);
  }
};

class Valent {
  version = '0.1.0';

  config = new ApplicationConfig({
    valent: {
      version: this.version,
      environment: {
        dev: true,
        debug: false,
      },
    },
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

    let isDevEnvironment = this.config.get('valent.environment.dev', true);

    // --- TRANSLATE COMPONENTS(DIRECTIVES)
    translateComponents(this[_framework], this[_components], this.config);

    // --- TRANSLATE CONTROLLERS
    let FrameworkControllerClass = this[_framework].controller;

    for (let controller of this[_controllers]) {
      let args = [controller.name, controller.controller, controller.options];

      let frameworkController = new FrameworkControllerClass(...args);

      if (isDevEnvironment) {
        let errors = FrameworkControllerClass.validate(...args);

        if (errors.length) {
          throw new RegisterException(
            controller.name,
            'valent-controller',
            errors
          );
        }
      }

      this[_framework].translate.controller(frameworkController, this.config);
    }

    // --- TRANSLATE ROUTES
    let FrameworkRouteClass = this[_framework].route;

    for (let route of this[_routes]) {
      let args = [route.name, route.url, route.options];

      let frameworkRoute = new FrameworkRouteClass(...args);

      if (isDevEnvironment) {
        let errors = FrameworkRouteClass.validate(...args);

        if (errors.length) {
          throw new RegisterException(route.name, 'valent-route', errors);
        }
      }

      this[_framework].translate.route(frameworkRoute, this.config);
    }

    this[_framework].bootstrap(this.config);
    this[_bootstrap] = true;
  }

  component(name, Component, options = {}) {
    const component = {
      name,
      controller: Component,
      options,
    };

    if (this[_bootstrap]) {
      console.info(`register comopnent "${name}" as lazy component`);
      translateComponents(this[_framework], [component], this.config);
      // throw new Error('component could no be registered after bootstrap');
    } else {
      this[_components].add(component);
    }
  }

  controller(name, Controller, options = {}) {
    if (this[_bootstrap]) {
      throw new Error('controller could no be registered after bootstrap');
    }

    this[_controllers].add({
      name,
      controller: Controller,
      options,
    });
  }

  route(name, url, options = {}) {
    if (this[_bootstrap]) {
      throw new Error('route could no be registered after bootstrap');
    }

    this[_routes].add({
      name,
      url,
      options,
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
