import DirectiveScope from '../wrappers/directive-scope';
import NgxModel from '../wrappers/ng-model';


function Convert(DirectiveModel) {
  var ControllerModel = DirectiveModel.getControllerModel();

  var ControllerFunction = function($scope, $attrs, ...dependencies) {
    var ControllerConstructor = ControllerModel.src;

    if (typeof ControllerConstructor != 'function') {
      throw new Error(`Wrong controller source definition for "${ControllerModel.name}". Expect function (constructor)`);
    }

    /**
     * Create controller Instance
     */
    var scope = new DirectiveScope(ControllerModel.name, $scope);

    /**
     * Apply directive pipes
     */
    var pipes = {};
    if (DirectiveModel.hasPipes()) {
      var registeredPipes = DirectiveModel.pipes;
      var givenPipes = {};

      if ($attrs.hasOwnProperty('pipes')) {
        givenPipes = $scope.pipes();
      }
      for (var registeredPipe of Object.keys(registeredPipes)) {

        var registeredPipeClass = registeredPipes[registeredPipe];
        var pipeInstance = null;

        if (givenPipes.hasOwnProperty(registeredPipe)) {
          pipeInstance = givenPipes[registeredPipe];

          if (!(pipeInstance instanceof registeredPipeClass)) {
            throw new Error(`Wrong instance of pipe "${registeredPipe}"`);
          }
        } else {
          pipeInstance = new registeredPipeClass();
        }

        pipes[registeredPipe] = pipeInstance;
        //deps.push(pipeInstance);
      }


      //scope.setPipes(pipes);
    } else if ($attrs.hasOwnProperty('pipes')) {
      throw new Error(`Pipes is not registered but pipe attribute is exists for directive "${DirectiveModel.name}"`);
    }

    /**
     * Create controller Instance
     */
    var ControllerInstance = new ControllerConstructor(...[scope, pipes].concat(dependencies));
    $scope.controller = ControllerInstance;

    $scope.$on('$destroy', function() {

      if (angular.isFunction(ControllerInstance.onDestroy)) {
        ControllerInstance.onDestroy();
      }
    });

    return $scope.controller;
  };

  var deps = ControllerModel.dependencies;
  var di = ['$scope', '$attrs'].concat([...deps, ControllerFunction]);

  var link = function($scope, element, attrs, ngModel) {

    var Controller = $scope.controller;
    if (DirectiveModel.hasModel()) {
      var scopeWrapper = Controller.getScope();
      var logger = scopeWrapper.getLogger();

      var Model = new NgxModel(ngModel, logger);

      Controller.applyModel(Model);

      if (!Model.isListening()) {
        throw new Error('NgModel should be attached to local scope. Use Modal.listen((value) => { ... })');
      }
    }

    if (angular.isFunction(Controller.link)) {
      Controller.link(element, attrs);
    }
  };

  var scopeConfig = DirectiveModel.scope;
  scopeConfig.pipes = '&pipes';

  var restrict = DirectiveModel.getRestrict();

  var DirectiveConfig = {
    transclude: !!DirectiveModel.transclude,
    restrict: restrict,
    replace: DirectiveModel.replace,
    scope: DirectiveModel.scope,
    controller: di,
    link: link
  };

  if (DirectiveModel.hasModel()) {
    DirectiveConfig.require = 'ngModel';
  }

  if (DirectiveModel.template) {
    DirectiveConfig.template = DirectiveModel.template;
  } else if (DirectiveModel.templateUrl) {
    DirectiveConfig.templateUrl = DirectiveModel.templateUrl;
  }

  return function() {
    return DirectiveConfig;
  };
}

export default function(directive) {
  var DirectiveModel = directive.model;

  var moduleName = DirectiveModel.module;

  if (!moduleName) {
    throw new Error(`application name is not described for directive: "${DirectiveModel.name}"`);
  }

  var DirectiveConstructor = Convert(DirectiveModel);

  angular.module(moduleName)
      .directive(DirectiveModel.name, DirectiveConstructor);
};
