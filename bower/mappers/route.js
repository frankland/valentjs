import { ResolveTemplateUrl } from '../url-utils';
import UrlManager from '../url-manager.js';

class RouteMapperError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Route mapper. ' + message;
  }
}


var register = function(route, $routeProvider) {

  var { base, path, resolve, controller, template, templateUrl }  = route.config;

  var config = {
    controller: controller,
    reloadOnSearch: false,
    resolve: resolve
  };

  if (template && templateUrl) {
    throw new RouteMapperError('For route "' + path + '" @template and @templateUrl is described');
  }

  if (template) {
    config.template = template;
  } else if (templateUrl) {
    config.templateUrl = ResolveTemplateUrl(route);
  } else {
    throw new RouteMapperError('@template or @templateUrl should be described');
  }

  var url = base + url;
  UrlManager.addRoute(controller, url);
  $routeProvider.when(base + url, config);
};

function byModule(routes) {
  var sorted = {};

  for (var route of routes) {

    var module_name = route.module_name;
    if (!sorted.hasOwnProperty(module_name)) {
      sorted[module_name] = [];
    }

    sorted[module_name].push(route);
  }

  return sorted;
}

var RouteMapper = function(routes) {

  var sorted = byModule(routes);

  for (var name of Object.keys(sorted)) {

    angular.module(name)
        .config(['$routeProvider', function($routeProvider) {

          for (var route of sorted[name]) {
            register(route, $routeProvider);
          }
        }]);
  }
};

export default RouteMapper;
