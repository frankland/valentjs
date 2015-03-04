import ConvertDi from './utils/convert-to-di';
import FillDefaults from './utils/fill-defaults';
import DirectiveScope from '../wrappers/scope/directive-scope';
import Injector from '../wrappers/injector';
import NgxModel from '../wrappers/ng-model';
import Logger from '../components/logger';

function Convert(directive) {

  var controller = directive.config.controller;
  var ControllerConstructor = controller.config.src;

  var loggerKey = Symbol('logger');

  var ControllerDi = function($injector, $scope, $attrs, ...dependencies) {

    if (typeof ControllerConstructor != 'function') {
      throw new Error('Wrong controller source definition. Expect function (constructor)');
    }

    /**
     * Create scope logger
     */
    var logger = Logger.create(controller.name);
    $scope[loggerKey] = logger;

    /**
     * Fill $scope with default values
     */
    //FillDefaults(controller, $scope);

    /**
     * Create controller Instance
     */
    var injector = new Injector($injector);
    var scope = new DirectiveScope($scope, injector, logger);

    /**
     * Apply directive state model
     */
    if (directive.config.hasOwnProperty('stateModel')) {
      var stateModel = directive.config.stateModel;

      var stateModelInstance = null;
      if ($attrs.hasOwnProperty('pipe')) {
        stateModelInstance = $scope.pipe();

        if (!(stateModelInstance instanceof stateModel)) {
          throw new Error('Wrong instance of pipe');
        }
      } else {
        stateModelInstance = new stateModel();
      }

      scope.setStateModel(stateModelInstance);

    } else if ($attrs.hasOwnProperty('pipe')) {
      throw new Error('State model is not defined but pipe attribute is exists');
    }

    /**
     * Create controller Instance
     */
    var ControllerInstance = new ControllerConstructor(...[scope, injector].concat(dependencies));

    $scope.controller = ControllerInstance;
    $scope.$on('$destroy', function() {
      //scope.unsubscribeDefault();

      if (angular.isFunction(ControllerInstance.onDestroy)) {
        ControllerInstance.onDestroy();
      }

      var stateModel = scope.getStateModel();

      if (stateModel.listeners != 0) {
        var logger = $scope[loggerKey];
        logger.warnColored(`directive destroyed. There are ${stateModel.listeners} unsubscribed listeners`);
      }
    });

    return $scope.controller;
  };

  var di = ConvertDi(directive, ['$scope', '$attrs', ControllerDi]);

  var link = function($scope, element, attrs, ngModel) {
    var Model = null;

    if (directive.config.withNgModel) {
      var logger = $scope[loggerKey];
      Model = new NgxModel(ngModel, logger);
    }

    if (angular.isFunction($scope.controller.link)) {

      if (directive.config.withNgModel) {
        $scope.controller.link(element, attrs, Model);

        if (!Model.isListening()) {
          throw new Error('NgModel should be attached to local scope. Use Modal.listen((value) => { ... })');
        }
      } else {
        $scope.controller.link(element, attrs);
      }
    }
  };

  var scopeConfig = directive.config.scope;
  scopeConfig.pipe = '&pipe';

  var DirectiveConfig = {
    transclude: !!directive.config.transclude,
    restrict: directive.config.restrict,
    replace: directive.config.replace,
    scope: directive.config.scope,
    controller: di,
    link: link
  };

  if (directive.config.withNgModel) {
    DirectiveConfig.require = 'ngModel';
  }

  if (directive.config.template) {
    DirectiveConfig.template = directive.config.template;
  } else if (directive.config.templateUrl) {
    DirectiveConfig.templateUrl = directive.config.templateUrl;
  } else {
    throw new Error('@template or @templateUrl should be described');
  }

  return function() {
    return DirectiveConfig;
  };
}

export default function(directive) {
  var moduleName = directive.module;

  if (!moduleName) {
    throw new Error('application name is not described for directive: "' + directive.name + '"');
  }

  var DirectiveConstructor = Convert(directive);

  angular.module(moduleName)
      .directive(directive.name, DirectiveConstructor);
};
