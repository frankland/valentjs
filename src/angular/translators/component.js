import camelCase from 'lodash/string/camelCase';
import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import uniq from 'lodash/array/uniq';

import Logger from '../../utils/logger';

import RuntimeException from '../../exceptions/runtime';
import DirectiveParams from '../services/directive-params';
import Scope from '../services/scope';


let initController = ($scope, $attrs, componentModel) => {
  let instances = [];

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
  let translatedParams = null;

  if (componentModel.isIsolated()) {
    translatedParams = Object.assign({}, params);

    let interfaces = componentModel.getInterfaces();
    let options = componentModel.getOptions();
    let pipes = componentModel.getPipes();

    let interfaceKeys = Object.keys(interfaces);
    let optionsKeys = Object.keys(options);
    let pipesKeys = Object.keys(pipes);

    let keys = interfaceKeys.concat(optionsKeys).concat(pipesKeys);
    let uniqKeys = uniq(keys);

    if (keys.length != uniqKeys.length) {
      throw new Error('options / interfaces / pipes could not have same keys');
    }

    for (let key of Object.keys(interfaces)) {
      let interfaceKey = camelCase(key);
      translatedParams[interfaceKey] = '=';
    }

    for (let key of Object.keys(options)) {
      let optionKey = camelCase(key);
      translatedParams[optionKey] = '=';
    }

    for (let key of Object.keys(pipes)) {
      let pipeKey = camelCase(key);
      translatedParams[pipeKey] = '=';
    }
  } else {
    translatedParams = !!params;
  }

  console.log(translatedParams);
  return translatedParams;
};

export default (componentModel) => {
  let module = componentModel.getModule();
  let controller = null;

  let link = (params, $scope, element, attrs, require) => {
    if (controller.link) {
      controller.link(element, params, $scope);
    }

    if (isArray(require)) {
      if (isFunction(controller.require)) {
        let requiredControllers = [];

        for (let required of require) {
          let requiredController = required;
          if (required.hasOwnProperty('$valent')) {
            let namespace = required.$value.namespace;
            requiredController = required[namespace];
          }

          requiredControllers.push(requiredController);
        }

        controller.require(...requiredControllers);

      } else {
        throw new Error('Require option is configured but controller does not has "require" method');
      }
    }

    // GC
    controller = null;
  };

  let configuration = {
    replace: false,
    restrict: translateRestrict(componentModel),
    scope: translateParams(componentModel),
    require: componentModel.getRequire(),
    controller: ['$scope', '$attrs', ($scope, $attrs) => {
      $scope.$valent = getValentInfo(componentModel);

      let name = componentModel.getName();
      try {
        controller = initController($scope, $attrs, componentModel);
      } catch (error) {
        throw new RuntimeException(name, 'component', error.message);
      }
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
  } else if (componentModel.hasTemplateMethod()) {

    // set template using Components method
    configuration.template = (element, attrs) => {
      let method = componentModel.getTemplateMethod();
      let template = method(element, attrs);

      if (!isString(template)) {
        let name = componentModel.getName();
        throw new RuntimeException(name, 'componentModel', 'result of Component.render() should be a string');
      }

      return template;
    }
  }

  return {
    name: componentModel.getDirectiveName(),
    module,
    configuration
  }
}
