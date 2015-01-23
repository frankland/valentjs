import ConvertDi from './utils/convert-to-di';
import FillDefaults from './utils/fill-defaults';
import Scope from '../components/scope';
import Injector from '../components/injector';

class ControllerConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Controller mapper. ' + message;
  }
}

export function ControllerConvert(controller) {
  var ControllerConstructor = controller.config.src;

  var ControllerDi = function($injector, $scope, ...dependencies) {

    if (typeof ControllerConstructor != 'function') {
      throw new ControllerConverterError('Wrong controller source definition. Expect function (constructor)');
    }

    FillDefaults(controller, $scope);

    var injector = new Injector($injector);
    var scope = new Scope($scope, injector, controller.name);


    $scope.controller = new ControllerConstructor(...[scope, injector].concat(dependencies));
  };

  return ConvertDi(controller, ['$scope', ControllerDi]);
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

