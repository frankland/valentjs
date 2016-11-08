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

  state = 'prepare';

  translate = {
    component: (component, config) => {
      let translated = componentTranslator(component, config);
      let application = translated.module || this[_app];

      if (this.state == 'started') {
        console.log('compile diretive', translated.name);
        this.compileProvider.directive(translated.name, () => translated.configuration);
      } else {
        angular.module(application)
          .directive(translated.name, () => translated.configuration);
      }
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
    this.state = 'bootstrap';

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

    /**
     * TODO: validation otherwise
     */
    let otherwise = config.get('routing.otherwise');
    let redirectTo = null;
    let otherwiseConfig = null;
    if (otherwise) {
      if (otherwise.length == 1) {
        redirectTo = otherwise[0];
      } else {
        // otherwise route
        // TODO: rework getting of renderMethod
        let renderMethod = otherwise[0].render;

        if (isFunction(renderMethod)) {
          otherwise[1].template = renderMethod;
        }

        let otherwiseRoute = new this.route('valent.otherwise', null, otherwise[1]);
        let translatedRoute = routeTranslator(otherwiseRoute, config);

        otherwiseConfig = translatedRoute.configuration;
        _routeModels.set('valent.otherwise', otherwiseRoute);

        // otherwise controller
        let otherwiseController = new this.controller('valent.otherwise', otherwise[0]);
        otherwiseController.otherwise = true;
        this.translate.controller(otherwiseController, config);
      }
    }

    app.config(['$locationProvider', '$routeProvider', '$compileProvider',
      ($locationProvider, $routeProvider, $compileProvider) => {
        this.compileProvider = $compileProvider;
        this.state = 'config';

        $locationProvider.html5Mode({
          enabled: config.get('routing.html5Mode'),
          requireBase: config.get('routing.requireBase')
        });

        if (redirectTo) {
          $routeProvider.otherwise({
            redirectTo
          });
        } else if (otherwiseConfig) {
          $routeProvider.otherwise(otherwiseConfig);
        }
      }]);

      app.run(['$injector', '$rootScope', '$location', ($injector, $rootScope, $location) => {
        this.state = 'run';

        // initialize injector
        Injector.setInjector($injector);

        // initialize route events
        let hooks = config.route.getHooks();

        if (isFunction(hooks.error)) {
          $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
            let hasRoute = current.hasOwnProperty('$$route');

            let currentRouteName = 'valent.otherwise';
            if (hasRoute) {
              currentRouteName = current.$$route.controller;
            }

            let previousRouteName = (previous && previous.$$route) ? previous.$$route.controller : null;

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
            let hasRoute = current.hasOwnProperty('$$route');

            let currentRouteName = 'valent.otherwise';
            if (hasRoute) {
              currentRouteName = current.$$route.controller;
            }

            let previousRouteName = (previous && previous.$$route) ? previous.$$route.controller : null;

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

          let hasRoute = current.hasOwnProperty('$$route');
          let currentRouteName = 'valent.otherwise';
          if (hasRoute) {
            currentRouteName = current.$$route.controller;
          }

          if (isFunction(hooks.start)) {
            let previousRouteName = (previous && previous.$$route) ? previous.$$route.controller : null;

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

        this.state = 'started';
    }]);
  }
}
