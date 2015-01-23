import ConvertDi from './utils/convert-to-di';
import FillDefaults from './utils/fill-defaults';
import DirectiveScope from '../components/directive-scope';
import Injector from '../components/injector';
import NgxModel from '../components/ngx-model';

class DirectiveConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Directive mapper. ' + message;
  }
}

function applyModel(scope, ngModel, directive, controller) {
  /**
   * Model
   */

  if (directive.config.model) {
    var key = directive.config.model;

    scope[key] = undefined;

    ngModel.$render = function() {
      var value = ngModel.$viewValue;
      scope[key] = value;

      if (angular.isFunction(controller.onRender)) {
        controller.onRender(value)
      }
    };

    scope.$watch(key, function(value) {

      ngModel.$setViewValue(value);

      if (angular.isFunction(controller.onChange)) {
        controller.onChange(value);
      }
    });
  }
}

function Convert(directive) {

  var controller = directive.config.controller;
  var ControllerConstructor = controller.config.src;

  var ControllerDi = function($injector, $scope, $attrs, ...dependencies) {

    if (typeof ControllerConstructor != 'function') {
      throw new DirectiveConverterError('Wrong controller source definition. Expect function (constructor)');
    }

    FillDefaults(controller, $scope);

    /**
     * Create controller Instance
     */
    var injector = new Injector($injector);
    var scope = new DirectiveScope($scope, injector, controller.name);

    /**
     * Apply directive state model
     */
    if (directive.config.hasOwnProperty('stateModel')) {
      var stateModel = directive.config.stateModel;

      var stateModelInstance = null;
      if ($attrs.hasOwnProperty('pipe')) {
        stateModelInstance = $scope.pipe();

        if (!(stateModelInstance instanceof stateModel)) {
          throw new DirectiveConverterError('Wrong instance of pipe');
        }
      } else {
        stateModelInstance = new stateModel();
      }

      scope.setStateModel(stateModelInstance);

    } else if ($attrs.hasOwnProperty('pipe')) {
      throw new DirectiveConverterError('State model is not defined but pipe attribute is exists');
    }

    /**
     * Create controller Instance
     */
    $scope.controller = new ControllerConstructor(...[scope, injector].concat(dependencies));

    $scope.$on('$destroy', function(){
      console.info(`Directive ${directive.name} destroyed`);
      scope.unsubscribeAll();
    });
  };

  var di = ConvertDi(directive, ['$scope', '$attrs', ControllerDi]);


  var scopeConfig = directive.config.scope;
  scopeConfig.pipe = '&pipe';

  var DirectiveConfig = {
    restrict: directive.config.restrict,
    replace: directive.config.replace,
    scope: directive.config.scope,
    controller: di,
    link: function(scope, element, attrs, ngModel) {
      var Model = null;

      if (directive.config.model) {
        Model = new NgxModel(ngModel);
      }

      if (angular.isFunction(scope.controller.link)) {
        if (directive.config.model) {
          scope.controller.link(element, attrs);
        } else {
          scope.controller.link(element, attrs, Model);

          if (!Model.isListening()) {
            throw new Error('NgModel should be attached to local scope. Use Modal.listen(()=>{})');
          }
        }
      }
    }
  };

  if (directive.config.model) {
    DirectiveConfig.require = 'ngModel';
  }

  if (directive.config.template) {
    DirectiveConfig.template = directive.config.template;
  } else if (directive.config.templateUrl) {
    DirectiveConfig.templateUrl = directive.config.templateUrl;
  } else {
    throw new DirectiveConverterError('@template or @templateUrl should be described');
  }

  return function() {
    return DirectiveConfig;
  };
}

export default function(directive) {
  var moduleName = directive.module;

  if (!moduleName) {
    throw new DirectiveConverterError('application name is not described for directive: "' + directive.name + '"');
  }

  var DirectiveConstructor = Convert(directive);

  angular.module(moduleName)
      .directive(directive.name, DirectiveConstructor);
};
