import UrlManager from '../url-manager.js';

class RouteConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Route mapper. ' + message;
  }
}

function Convert(route, $routeProvider) {

  var { url, controller, resolve } = route.config;
  var config = {
    controller: controller,
    reloadOnSearch: false,
    resolve: resolve
  };

  var { template, templateUrl } = route.config;
  if (template && templateUrl) {
    throw new RouteConverterError(`For route "${url}" @template and @templateUrl is described`);
  }

  if (template) {
    config.template = template;
  } else if (templateUrl) {
    config.templateUrl = templateUrl;
  } else {
    throw new RouteConverterError('@template or @templateUrl should be described');
  }

  var { base, buildUrl } = route.config;
  UrlManager.addRoute(controller, buildUrl);

  return {
    url: base + url,
    config: config
  };
}

function byModule(routes) {
  var sorted = {};

  for (var route of routes) {

    var moduleName = route.module;

    if (!sorted.hasOwnProperty(moduleName)) {
      sorted[moduleName] = [];
    }

    sorted[moduleName].push(route);
  }

  return sorted;
}

export default function(routes, moduleName) {
  var sorted;

  if (moduleName) {
    sorted = {
      [moduleName]: routes
    };
  } else {
    sorted = byModule(routes);
  }

  for (var name of Object.keys(sorted)) {

    angular.module(name)
        .config(['$routeProvider', function($routeProvider) {

          for (var route of sorted[name]) {
            var {url, config } = Convert(route);

            $routeProvider.when(url, config);
          }
        }]);
  }
};

