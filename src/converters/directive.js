import DirectiveScope from '../wrappers/directive-scope';
import NgxModel from '../wrappers/ng-model';

function Convert(DirectiveModel) {
  var ControllerModel = DirectiveModel.getControllerModel();

  var ControllerFunction = function($scope, $attrs, ...dependencies) {
    var ControllerConstructor = ControllerModel.src;

    if (typeof ControllerConstructor != 'function') {
      throw new Error('Wrong controller source definition. Expect function (constructor)');
    }

    /**
     * Create controller Instance
     */
    var scope = new DirectiveScope(ControllerModel.name, $scope);

    /**
     * Apply directive pipes
     */
    if (DirectiveModel.hasPipes()) {
      var registeredPipes = DirectiveModel.pipes;
      var givenPipes = {};
      var pipes = {};

      if ($attrs.hasOwnProperty('pipe')) {
        givenPipes = $scope.pipe();
      }
      for (var registeredPipe of Object.keys(registeredPipes)) {

        var registeredPipeClass = registeredPipes[registeredPipe];
        var pipeInstance = null;

        if (givenPipes.hasOwnProperty(registeredPipe)) {
          pipeInstance = givenPipes[registeredPipe];

          if (!(pipeInstance instanceof registeredPipeClass)) {
            throw new Error('Wrong instance of pipe "`${registeredPipe}`"');
          }
        } else {
          pipeInstance = new registeredPipeClass();
        }



        pipes[registeredPipe] = pipeInstance;
      }

      scope.setPipes(pipes);
    } else if ($attrs.hasOwnProperty('pipe')) {
      throw new Error('Pipes is not registered but pipe attribute is exists for directive "`${DirectiveModel.name}`"');
    }

    /**
     * Create controller Instance
     */
    var ControllerInstance = new ControllerConstructor(...[scope].concat(dependencies));

    $scope.controller = ControllerInstance;
    $scope.$on('$destroy', function() {
      if (angular.isFunction(ControllerInstance.onDestroy)) {
        ControllerInstance.onDestroy();
      }

      if (DirectiveModel.hasPipe()) {
        var pipe = scope.getPipe();

        if (pipe.listeners != 0) {
          var Controller = $scope.controller;
          var scopeWrapper = Controller.getScope();
          var logger = scopeWrapper.getLogger();

          logger.warn(`directive destroyed. There are ${pipe.listeners} unsubscribed listeners`);
        }
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
  scopeConfig.pipe = '&pipe';

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
