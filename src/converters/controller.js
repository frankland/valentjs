import ConvertDi from './utils/convert-to-di';
import FillDefaults from './utils/fill-defaults';
import Scope from '../wrappers/scope/scope';
import Injector from '../wrappers/injector';
import Logger from '../components/logger';


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

    /**
     * Fill $scope with default values
     */
    FillDefaults(controller, $scope);

    /**
     * Create scope logger
     */
    var logger = Logger.create(controller.name);


    var injector = new Injector($injector);
    var scope = new Scope($scope, injector, logger);


    var ControllerInstance = new ControllerConstructor(...[scope, injector].concat(dependencies));
    $scope.controller = ControllerInstance;


    $scope.$on('$destroy', function() {
      if (angular.isFunction(ControllerInstance.onDestroy)) {
        ControllerInstance.onDestroy();
      }
    });
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

