import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';

import Manager from '../index';
import Injector from '../components/injector';
import Config from '../components/config';
import Logger from '../components/logger';
import RouteConfig from '../route/route-config';

import ControllerConverter from './converters/controller-converter';
import FactoryConverter from './converters/factory-converter';
import DirectiveConverter from './converters/directive-converter';
import RouteConverter from './converters/route-converter';

function setupApplication(module) {
  module.run(['$injector', '$rootScope', '$location', function($injector, $rootScope, $location) {
    Injector.setInjector($injector);

    var onRouteChangeError = RouteConfig.getOnRouteChangeError();
    if (onRouteChangeError) {
      $rootScope.$on('$routeChangeError', () => {
        var url = onRouteChangeError();

        if (isString(url)) {
          $location.url(url);
        }
      });
    }

    var onRouteChangeStart = RouteConfig.getOnRouteChangeStart();
    $rootScope.$on('$routeChangeStart', () => {
      Logger.resetColors();

      if (isFunction(onRouteChangeStart)) {
        onRouteChangeStart();
      }
    });
  }]);
}

var local = {
  module: Symbol('angular-module'),
  application: Symbol('application-name')
};

export default class AngularBootstrap {
  constructor(application, deps = []) {
    if (!isString(application)) {
      throw new Error('Wrong module name');
    }

    if (!isArray(deps)) {
      throw new Error('Wrong module dependencies');
    }

    this[local.application] = application;
    this[local.module] = angular.module(application, deps);
  }

  getModule() {
    return this[local.module];
  }

  bootstrap() {
    this.register();

    var module = this.getModule();
    setupApplication(module);
  }


  register() {
    var application = this[local.application];

    var { controllers, factories, directives, routes } = Manager.getModels();

    ControllerConverter.register(controllers, application);
    FactoryConverter.register(factories, application);
    DirectiveConverter.register(directives, application);

    RouteConverter.setup();
    RouteConverter.register(routes, application);

    Manager.clear();
  }
}
