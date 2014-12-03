import { resolveTemplateUrl } from '../url-manager';

var register = function (route, $routeProvider) {

  angular.extend(route.config.resolve, {
    done: function () {
      console.log('route ' + route.config.url + ' resolving: Controller: ' + route.config.controller);
    }
  });

  var { base, url, resolve, controller, template, templateUrl }  = route.config;

  var config = {
    controller: controller,
    reloadOnSearch: false,
    resolve: resolve
  };

  if (template && templateUrl){
    throw new Error('System.Route mapper: for route "' + url + '" @template and @templateUrl is described');
  }

  if (template){
    config.template = template;
  } else if(templateUrl) {
    config.templateUrl = resolveTemplateUrl(route);
  } else {
    throw new Error('System.Route mapper: @template or @templateUrl should be described');
  }

  $routeProvider.when(base + url, config);
};

var RouteMapper = function (routes) {
  var byModule = {};

  for (var route of routes) {
    var module_name = route.module_name;
    if (!byModule.hasOwnProperty(module_name)) {
      byModule[module_name] = [];
    }

    byModule[module_name].push(route);
  }

  for (var name of Object.keys(byModule)) {

    angular.module(name)
      .config(['$routeProvider', function ($routeProvider) {

        for (var route of byModule[name]) {
          register(route, $routeProvider);
        }
      }]);
  }
};

export default  RouteMapper;
