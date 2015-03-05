import UrlManager from '../url-manager.js';


function Convert(RouteModel) {

  var config = {
    controller: RouteModel.controller,
    reloadOnSearch: false,
    resolve: RouteModel.resolve
  };

  if (RouteModel.template && RouteModel.templateUrl) {
    throw new Error(`For route "${RouteModel.url}" @template and @templateUrl is described`);
  }

  if (RouteModel.template) {
    config.template = RouteModel.template;
  } else if (RouteModel.templateUrl) {
    config.templateUrl = RouteModel.templateUrl;
  } else {
    throw new Error('@template or @templateUrl should be described');
  }

  UrlManager.addRoute(RouteModel.controller, RouteModel.urlBuilder);

  return {
    url: RouteModel.base + RouteModel.url,
    config: config
  };
}

function byModule(routes) {
  var sorted = {};

  for (var route of routes) {

    var RouteModel = route.model;
    var moduleName = RouteModel.module;

    if (!moduleName) {
      throw new Error(`Module is not defined for route "${RouteModel.url}"`);
    }

    if (!sorted.hasOwnProperty(moduleName)) {
      sorted[moduleName] = [];
    }

    sorted[moduleName].push(RouteModel);
  }

  return sorted;
}

export default function(routes) {

  var sorted = byModule(routes);

  for (var name of Object.keys(sorted)) {

    angular.module(name)
        .config(['$routeProvider', function($routeProvider) {
          for (var RouteModel of sorted[name]) {
            var {url, config } = Convert(RouteModel);

            $routeProvider.when(url, config);
          }
        }]);
  }
};

