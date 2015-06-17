import groupBy from 'lodash/collection/groupBy';
import clone from 'lodash/lang/cloneDeep';
import isObject from 'lodash/lang/isPlainObject';
import isString from 'lodash/lang/isString';

import RouteModel from '../../route/route-model';
import RouteConfig from '../../route/route-config';

import Url from '../../components/url';

export default class RouteConverter {

  static register(routes, defaultApplication) {
    var sorted = groupBy(routes, (route) => {
      /**
       * Return default application name if not set at route
       */
      return route.getApplicationName() || defaultApplication;
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
      reloadOnSearch: model.getReloadOnSearch(),
      resolve: RouteConverter.getResolve(model)
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

  static getResolve(model) {
    var resolve = Object.assign({}, RouteConfig.getResolve(), model.getResolve());

    var normalizedResolvers = {};
    for (var resolver of Object.keys(resolve)) {
      var func = resolve[resolver];
      normalizedResolvers[resolver] = func.bind(null, model);
    }

    return normalizedResolvers;
  }

  static getUrls(model) {
    var base = RouteConfig.getBase() || '';
    return model.getUrls().map((url) => base + url);
  }

  static convertOtherwise(otherwise) {
    var converted = null;

    if (isString(otherwise)) {
      converted = {
        redirectTo: otherwise
      };
    } else if (otherwise instanceof RouteModel) {
      converted = RouteConverter.getConfig(otherwise);
    } else {
      throw new Error('Wrong otherwise config. Should be an object or a string. String will be converted to @redirectTo url');
    }

    return converted;
  }

  static setup(application) {
    var config = {
      otherwise: RouteConfig.getOtherwise(),
      isHtml5Mode: RouteConfig.isHtml5Mode()
    };


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
