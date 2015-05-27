import isFunction from 'lodash/lang/isFunction';

import Injector from '../components/injector';
import Config from '../components/config';
import Logger from '../components/logger';
import RouteConfig from '../route/route-config';

import Angular from 'angular';
import AngularRoute from 'angular-route';

function createModule() {
  var applicationName = Config.getApplicationName();
  angular.module(applicationName, [
    'ngRoute'
  ]);
}

function setupApplication() {
  var applicationName = Config.getApplicationName();

  angular.module(applicationName)
    .run(['$injector', '$rootScope', '$location', function($injector, $rootScope, $location) {
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


export default () => {
  createModule();
  setupApplication();
}
