import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import Injector from '../components/injector';
import Config from '../components/config';
import Logger from '../components/logger';
import RouteConfig from '../route/route-config';

import angular from 'angular';
import angularRoute from 'angular-route';

function setupApplication(mainModule) {

  mainModule.run(['$injector', '$rootScope', '$location', function($injector, $rootScope, $location) {
      Injector.setInjector($injector);

      var onRouteChangeError = RouteConfig.getOnRouteChangeError();
      if (onRouteChangeError) {
        $rootScope.$on('$routeChangeError', () => {
          var url = onRouteChangeError();
          if (url) {
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


export default class AngularBootstrap {
  static createModule(name, deps = []) {
    if (!isArray(deps)) {
      throw new Error('Dependencies for angular module should be array');
    }

    return angular.module(name, deps);
  }

  static bootstrap(deps) {
    var applicationName = Config.getApplicationName();
    var normalizedDeps = deps.concat([]);
    if (deps.indexOf('ngRoute') == -1) {
      normalizedDeps.push('ngRoute');
    } else {
      console.warn('ngRoute will be automatically added as dependency for boot module');
    }

    var mainModule = AngularBootstrap.createModule(applicationName, normalizedDeps);
    setupApplication(mainModule);

    return mainModule;
  }
}
