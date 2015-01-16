import EnchantDi from './enchant/di';
import ScopeApi from '../components/scope-api';
import InjectorApi from '../components/injector-api';

class ControllerConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Controller mapper. ' + message;
  }
}

function fillDefaults(controller, $scope){

  if (controller.config.defaults) {
    var defaults = controller.config.defaults;

    for (var item of Object.keys(defaults)) {
      $scope[item] = defaults[item];
    }
  }
}


export function ControllerConvert(controller) {
  var ControllerConstructor = controller.config.src;

  var ControllerDi = function($injector, $scope, ...dependencies) {

    if (typeof ControllerConstructor != 'function') {
      throw new ControllerConverterError('Wrong controller source definition. Expect function (constructor)');
    }

    fillDefaults(controller, $scope);

    var scopeApi = new ScopeApi($scope, controller.name);
    var injectorApi = new InjectorApi($injector);


    $scope.controller = new ControllerConstructor(...[scopeApi, injectorApi].concat(dependencies));
  };

  return EnchantDi(controller, ControllerDi, ['$scope']);
}


export default function(controller) {
  var moduleName = controller.module;

  if (!moduleName) {
    throw new ControllerConverterError('application name is not described for controller: "' + controller.name + '"');
  }

  if (!controller.config.src) {
    throw new ControllerConverterError('Controller source is not set');
  }

  var di = ControllerConvert(controller);

  angular.module(moduleName)
      .controller(controller.name, di);
};

