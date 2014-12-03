var translate = function (controller){
  var AppController = controller.config.src;

  var src = function ($scope, $injector, ...dependencies) {
    if (controller.config.defaults) {
      angular.extend($scope, controller.config.defaults);
    }

    if (angular.isObject(AppController)) {

      for (var attr in AppController){
        $scope[attr] = AppController[attr];
      }

      /**
       * Get angular dependencies
       */
      $scope.get = function (name) {
        if (!$injector.has(name)) {
          throw new Error('Controller $injector: dependency is not registered: "' + name + '"');
        }

        return $injector.get(name);
      };

      if (angular.isFunction($scope.initialize)) {
        $scope.initialize.apply($scope, dependencies);
      }
    } else if (angular.isFunction(AppController)) {

      AppController.apply(null, [$scope].concat(dependencies));
    } else {
      throw new Error('Wrong controller.src type');
    }
  };

  /**
   * $scope and $injector are defaults
   */

  var di = ['$scope', '$injector'].concat(controller.config.dependencies);
  di.push(src);
  return di;
};


var register = function(controller){
  var module_name = controller.module;

  if (!module_name) {
    throw new Error('System.Controller.Mapper: application name is not described');
  }

  if (!controller.config.src) {
    throw new Error('System.Controller.Mapper: controller source is not set');
  }

  angular.module(module_name)
    .controller(controller.name, translate(controller));
};

var ControllerMapper = function(components){
  for (var component of components){
    register(component);
  }
};

export default ControllerMapper;
export var ControllerTranslate = translate;
