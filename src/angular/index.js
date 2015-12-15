import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';

import Injector from './services/injector';
import Logger from '../utils/logger';

import componentTranslator from './translators/component';
import controllerTranslator from './translators/controller';
import routeTranslator from './translators/route';

import AngularComponent from './angular-component';
import AngularController from './angular-controller';
import AngularRoute from './angular-route';

import AngularUrl from './angular-url';
import AngularUrlManager from './angular-url-manager';

let _app = Symbol('angular-module');
let _urlManager = Symbol('url-manager');

let _routeModels = new Map();

export default class Angular {
  component = AngularComponent;
  controller = AngularController;
  route = AngularRoute;

  translate = {
    component: (component, config) => {
      let translated = componentTranslator(component, config);
      let application = translated.module || this[_app];

      angular.module(application)
        .directive(translated.name, () => translated.configuration);
    },

    controller: (controller, config) => {
      let translated = controllerTranslator(controller, config);
      let application = translated.module || this[_app];

      angular.module(application)
        .controller(translated.name, translated.configuration);
    },

    route: (route, config) => {
      let name = route.getName();
      let translated = routeTranslator(route, config);

      let urlManager = this[_urlManager];
      urlManager.set(name, translated.url);

      let application = translated.module || this[_app];

      _routeModels.set(name, route);

      angular.module(application)
        .config(['$routeProvider', ($routeProvider) => {

          for (let url of translated.routes) {
            $routeProvider.when(url, translated.configuration);
          }
        }]);
    }
  };

  constructor(app, options = {}) {
    if (!app || !isString(app)) {
      throw new Error('Angular module should be a string');
    }

    this[_app] = app;
    this[_urlManager] = new AngularUrlManager();

    if (options.dependencies) {
      angular.module(app, options.dependencies);
    }
  }

  getAngularModule() {
    let app = this[_app];
    return angular.module(app);
  }

  getUrlManager() {
    return this[_urlManager];
  }

  bootstrap(config) {
    let module = this[_app];

    // initialize exception handler
    let exceptionHandler = config.exception.getHandler();
    if (isFunction(exceptionHandler)) {
      angular.module(module).config(['$provide', ($provide) => {

        $provide.decorator('$exceptionHandler', ($delegate) => {
          return (exception, cause) => {
            exceptionHandler(exception, cause, $delegate);
          }
        });
      }]);
    }

    let app = this.getAngularModule();

    /**
     * NOTE: used for controllers if there is no global or local resolver.
     * If remove this factory will be exception
     * "Unknown provider: valent.resolveProvider <- valent.resolve <- root"
     */
    app.factory('valent.resolve', () => ({}));


    app.config(['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) => {
      $locationProvider.html5Mode({
        enabled: config.get('routing.html5Mode'),
        requireBase: config.get('routing.requireBase')
      });

      let otherwise = config.get('routing.otherwise');

      if (otherwise) {
        let otherwiseConfig = {};

        if (isString(otherwise)) {
          otherwiseConfig.redirectTo = otherwise;
        } else {
          // TODO: lol
          throw new Error('That is really lol but this case is not implemented ("otherwise" is not a string)');
        }

        $routeProvider.otherwise(otherwiseConfig);
      }
    }]);

    app.run(['$injector', '$rootScope', '$location', ($injector, $rootScope, $location) => {
      // initialize injector
      Injector.setInjector($injector);

      // initialize route events
      let hooks = config.route.getHooks();

      if (isFunction(hooks.error)) {
        $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
          let currentRouteName = current.$$route.controller;
          let previousRouteName = previous ? previous.$$route.controller : null;

          let currentRouteModel = _routeModels.get(currentRouteName);
          let previousRouteModel = null;

          if (previousRouteName) {
            previousRouteModel = _routeModels.get(previousRouteName);
          }

          hooks.error(currentRouteModel, previousRouteModel, rejection, () => {
            event.preventDefault();
          });
        });
      }

      if (isFunction(hooks.success)) {
        $rootScope.$on('$routeChangeSuccess', (event, current, previous) => {
          let currentRouteName = current.$$route.controller;
          let previousRouteName = previous ? previous.$$route.controller : null;

          let currentRouteModel = _routeModels.get(currentRouteName);
          let previousRouteModel = null;

          if (previousRouteName) {
            previousRouteModel = _routeModels.get(previousRouteName);
          }

          hooks.success(currentRouteModel, previousRouteModel, () => {
            event.preventDefault();
          });
        });
      }

      $rootScope.$on('$routeChangeStart', (event, current, previous) => {
        Logger.resetColors();

        let routeName = current.$$route.controller;
        valent.url.setCurrentRoute(routeName);

        if (isFunction(hooks.start)) {
          let currentRouteName = current.$$route.controller;
          let previousRouteName = previous ? previous.$$route.controller : null;

          let currentRouteModel = _routeModels.get(currentRouteName);
          let previousRouteModel = null;

          if (previousRouteName) {
            previousRouteModel = _routeModels.get(previousRouteName);
          }

          hooks.start(currentRouteModel, previousRouteModel, () => {
            event.preventDefault();
          });
        }
      });
    }]);
  }
}
