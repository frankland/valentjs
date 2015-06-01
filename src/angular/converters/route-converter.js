import groupBy from 'lodash/collection/groupBy';
import clone from 'lodash/lang/cloneDeep';
import isObject from 'lodash/lang/isPlainObject';
import isString from 'lodash/lang/isString';

import RouteModel from '../../route/route-model';
import RouteConfig from '../../route/route-config';

import Url from '../../components/url';
import Config from '../../components/config';

export default class RouteConverter {

  static register(routes) {
    var sorted = groupBy(routes, (route) => {
      var application = route.getApplicationName();

      /**
       * Return default application name if not set at route
       */
      return application ? application : Config.getApplicationName();
    });


    for (var application of Object.keys(sorted)) {
      angular.module(application)
        .config(['$routeProvider', ($routeProvider) => {

          for (var route of sorted[application]) {
            if (!(route instanceof RouteModel)) {
              throw new Error('Wrong route model instance');
            }

            var controllerName = route.getControllerName();

            if (route.hasUrlBuilder()) {
              Url.add(controllerName, route.getUrlBuilder());
            }

            var config = RouteConverter.getConfig(route);
            var urls = RouteConverter.getUrls(route);

            for (var url of urls) {
              $routeProvider.when(url, config);
            }
          }
        }]);
    }
  }

  static getConfig(model) {
    var controllerName = model.getControllerName();
    var config = {
      controller: controllerName,
      reloadOnSearch: false,
      resolve: model.getResolve()
    };

    var template = model.getTemplate();
    var templateUrl = model.getTemplateUrl();

    if (template) {
      config.template = template;
    } else if (templateUrl) {
      config.templateUrl = templateUrl;
    } else {
      throw model.exception.noTemplateOrTemplateUrl();
    }

    return clone(config);
  }

  static getUrls(model) {
    var base = RouteConfig.getBase() || '';
    return model.getUrls().map((url) => base + url);
  }

  static convertOtherwise(otherwise) {
    var converted = null;
    if (isObject(otherwise)) {
      converted = otherwise;
    } else if (isString(otherwise)) {
      converted = {
        redirectTo: otherwise
      };
    } else {
      throw new Error('Wrong otherwise config. Should be an object or a string. String will be converted to @redirectTo url');
    }

    return converted;
  }

  static setup() {
    var config = {
      otherwise: RouteConfig.getOtherwise(),
      isHtml5Mode: RouteConfig.isHtml5Mode()
    };

    var application = Config.getApplicationName();

    angular.module(application)
      .config(['$locationProvider', '$routeProvider',
        ($locationProvider, $routeProvider) => {

          $locationProvider.html5Mode({
            enabled: config.isHtml5Mode,
            requireBase: false
          });

          if (config.otherwise) {
            var otherwise = RouteConverter.convertOtherwise(config.otherwise);
            $routeProvider.otherwise(otherwise);
          }
        }]);
  }
}
