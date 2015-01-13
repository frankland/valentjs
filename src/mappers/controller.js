class ControllerMapperError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Controller mapper. ' + message;
  }
}


var ControllerTranslate = function(controller) {
  var ControllerConstructor = controller.config.src;

  var ControllerFunction = function($scope, $injector, ...dependencies) {

    if (controller.config.defaults) {
      var defaults = controller.config.defaults;
      for (var item of Object.keys(defaults)) {
        $scope[item] = defaults[item];
      }
    }


    if (typeof ControllerConstructor != 'function') {
      throw new ControllerMapperError('Wrong controller source definition. Expect function (constructor)');
    }

    var Instance = new ControllerConstructor(...[$scope].concat(dependencies));
    if (typeof Instance.setInjector == 'function') {
      Instance.setInjector($injector);
    }

    $scope.controller = Instance;
  };

  /**
   * $scope and $injector are defaults
   */
  var di = ['$scope', '$injector'].concat(controller.config.dependencies);

  di.push(ControllerFunction);

  return di;
};


var register = function(controller) {
  var module_name = controller.module;

  if (!module_name) {
    throw new ControllerMapperError('application name is not described for controller: "' + controller.name + '"');
  }

  if (!controller.config.src) {
    throw new ControllerMapperError('Controller source is not set');
  }

  var di = ControllerTranslate(controller);

  angular.module(module_name)
      .controller(controller.name, di);
};

var ControllerMapper = function(components) {
  for (var component of components) {
    register(component);
  }
};


export default ControllerMapper;
export { ControllerTranslate };
