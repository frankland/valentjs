import UrlManager from '../url-manager.js';
import Config from '../components/config';

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

  var baseUrl = RouteModel.base;

  if (!baseUrl) {
    baseUrl = Config.getBaseUrl();
  }

  return {
    url: baseUrl + RouteModel.url,
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
  var routeProvider = Config.getRouteProviderName();

  if (Config.useHtml5()) {
    var moduleName = Config.getModuleName();
    angular.module(moduleName).config(['$locationProvider',
      ($locationProvider) => $locationProvider.html5Mode(true)]);
  }

  for (var name of Object.keys(sorted)) {
    angular.module(name)
        .config([routeProvider, ($routeProvider) => {
          for (var RouteModel of sorted[name]) {
            var {url, config } = Convert(RouteModel);

            $routeProvider.when(url, config);
          }
        }]);
  }
};

