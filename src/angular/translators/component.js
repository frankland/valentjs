import camelCase from 'lodash/string/camelCase';
import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import Logger from '../../utils/logger';
import Injector from '../services/injector';
import Compiler from '../services/compiler';

import DirectiveParams from '../services/directive-params';
import Scope from '../services/scope';


let initController = ($scope, $attrs, componentModel) => {
  let instances = [];

  if (componentModel.hasInterfaces()) {
    // gather interfaces
    let interfaces = componentModel.getInterfaces();

    for (let key of Object.keys(interfaces)) {
      let instance = $scope[key];

      if (!instance) {
        throw Error(`directive should implements interface "${key}"`);
      }

      let InterfaceClass = interfaces[key];

      if (!(instance instanceof InterfaceClass)) {
        throw Error(`interface "${key}" has wrong class`);
      }

      instances.push(instance);
    }
  }


  if (componentModel.hasOptions()) {
    // gather options
    let options = componentModel.getOptions();

    for (let key of Object.keys(options)) {
      let interfaceInstance = $scope[key];

      let instance = null;
      if (interfaceInstance) {

        let InterfaceClass = options[key];

        if (!(interfaceInstance instanceof InterfaceClass)) {
          throw Error(`interface "${key}" has wrong class`);
        }

        instance = $scope[key];
      }

      instances.push(instance);
    }
  }

  let Controller = componentModel.getController();
  let params = new DirectiveParams($scope, $attrs, componentModel);

  let name = componentModel.getName();
  let logger = Logger.create(name);

  let controller = new Controller(...instances, params, logger);
  Scope.attach(controller, $scope);

  if (componentModel.isIsolated()) {
    let namespace = componentModel.getNamespace();
    $scope[namespace] = controller;
  }

  // $scope events
  $scope.$on('$destroy', () => {
    if (isFunction(controller.destructor)) {
      controller.destructor();
    }
  });

  return controller;
};

let getValentInfo = (componentModel) => {
  return {
    type: 'component',
    name: componentModel.getName(),
    namespace: componentModel.getNamespace()
  };
};

let translateRestrict = (componentModel) => {
  let restrict = 'E';

  // TODO: check if we need to compile directive with restrict A
  if (componentModel.withoutTemplate() && !componentModel.hasCompileMethod()) {
    restrict = 'A';
  }

  return restrict;
};

let translateParams = (componentModel) => {
  let params = componentModel.getParams();
  let angularScope = null;

  if (componentModel.isIsolated()) {
    angularScope = Object.assign({}, params);

    if (componentModel.hasInterfaces()) {
      let interfaces = componentModel.getInterfaces();

      for (let key of Object.keys(interfaces)) {
        angularScope[key] = '=';
      }
    }

    if (componentModel.hasOptions()) {
      let options = componentModel.getOptions();

      for (let key of Object.keys(options)) {
        angularScope[key] = '=';
      }
    }

    if (componentModel.hasPipes()) {
      let pipes = componentModel.getPipes();

      for (let key of Object.keys(pipes)) {
        angularScope[key] = '=';
      }
    }
  } else {
    angularScope = false;
  }

  return angularScope;
};

export default (componentModel) => {
  let module = componentModel.getModule();
  let controller = null;

  let link = (params, $scope, element, attrs, require) => {
    // Execute require function
    if (isArray(require)) {
      if (isFunction(controller.require)) {
        let configuredRequire = componentModel.getRequire();

        let requiredControllers = {};
        let index = 0;

        for (let required of require) {
          if (required) {
            let requiredController = required;

            if (required.hasOwnProperty('$valent')) {
              let namespace = required.$valent.namespace;
              requiredController = required[namespace];
            }

            let key = configuredRequire[index];
            let normalized = key.replace(/[\?\^]*/, '');
            requiredControllers[normalized] = requiredController;

          }
          index++;
        }

        controller.require(requiredControllers);
      } else {
        let name = componentModel.getName();
        throw new Error(`directive "${name}" - Require option is configured but controller does not has "require" method`);
      }
    }

    // Execute link function
    if (controller.link) {
      let compile = Compiler($scope);
      controller.link(element, attrs, params, compile, $scope);
    }

    // GC
    controller = null;
  };

  let configuration = {
    replace: false,
    transclude: componentModel.getTransclude(),
    restrict: translateRestrict(componentModel),
    scope: translateParams(componentModel),
    require: componentModel.getRequire(),
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      let valentInfo = getValentInfo(componentModel);
      let namespace = valentInfo.namespace;

      $scope.$valent = valentInfo;


      // controller - closed var.
      controller = initController($scope, $attrs, componentModel);

      // for correct work directive's require
      this[namespace] = controller;
      this.$valent = getValentInfo(componentModel);
    }],

    link: ($scope, element, attrs, require) => {
      link(null, $scope, element, attrs, require)
    }
  };

  let Controller = componentModel.getController();

  if (isFunction(Controller.compile)) {
    configuration.compile = (element, attrs) => {
      let params = Controller.compile(element, attrs);

      return ($scope, element, attrs, require) => {
        link(params, $scope, element, attrs, require);
      }
    };
  }

  if (componentModel.hasTemplate()) {

    // set template
    configuration.template = componentModel.getTemplate();
  } else if (componentModel.hasTemplateUrl()) {

    // set templateUrl
    configuration.templateUrl = componentModel.getTemplateUrl();
  }
  //else if (componentModel.hasRenderMethod()) {
  //
  //  // set template using Components method
  //  configuration.template = (element, attrs) => {
  //    let method = componentModel.getRenderMethod();
  //    let template = method(element, attrs);
  //
  //    if (!isString(template)) {
  //      let name = componentModel.getName();
  //      throw new Error(`"${name}" - result of Component.render() should be a string`);
  //    }
  //
  //    return template;
  //  }
  //}

  return {
    name: componentModel.getDirectiveName(),
    module,
    configuration
  }
}
