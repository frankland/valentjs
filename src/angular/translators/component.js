import camelCase from 'lodash/string/camelCase';
import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import Logger from '../../utils/logger';

import RuntimeException from '../../exceptions/runtime';
import DirectiveParams from '../services/directive-params';
import Scope from '../services/scope';


let initController = ($scope, $attrs, model) => {
  let instances = [];

  // gather interfaces
  let interfaces = model.getInterfaces();

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

  // gather optional
  let optionals = model.getOptional();

  for (let key of Object.keys(optionals)) {
    let interfaceInstance = $scope[key];

    let instance = null;
    if (interfaceInstance) {

      let InterfaceClass = optionals[key];

      if (!(interfaceInstance instanceof InterfaceClass)) {
        throw Error(`interface "${key}" has wrong class`);
      }

      instance = $scope[key];
    }

    instances.push(instance);
  }

  let Controller = model.getController();
  let params = new DirectiveParams($scope, $attrs, model);

  let name = model.getName();
  let logger = Logger.create(name);

  let controller = new Controller(...instances, params, logger);
  Scope.attach(controller, $scope);

  if (model.isIsolated()) {
    let namespace = model.getNamespace();
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

let getValentInfo = (component) => {

  return {
    type: 'component',
    name: component.getName(),
    namespace: component.getNamespace()
  };
};

let translateRestrict = (component) => {
  let restrict = 'E';

  if (component.withoutTemplate()) {
    //restrict = 'A';
  }

  return restrict;
};

let translateParams = (component) => {
  let translatedParams = component.getParams();

  if (component.isIsolated() && isObject(translatedParams)) {
    translatedParams = Object.assign({}, translatedParams);

    let interfaces = component.getInterfaces();
    let optionals = component.getOptional();
    let substitutions = component.getSubstitution();

    // TODO: cross of 3 arrays
    for (let key of Object.keys(interfaces)) {
      if (optionals.hasOwnProperty(key)) {
        throw new Error('optionals and interfaces could not have same keys');
      }
    }

    for (let key of Object.keys(interfaces)) {
      let translatedKey = camelCase(key);
      translatedParams[translatedKey] = '=';
    }

    for (let key of Object.keys(optionals)) {
      let translatedKey = camelCase(key);
      translatedParams[translatedKey] = '=';
    }

    for (let key of Object.keys(substitutions)) {
      let translatedKey = camelCase(key);
      translatedParams[translatedKey] = '=';
    }
  }

  console.log(translatedParams);
  return translatedParams;
};

export default (component) => {
  let module = component.getModule();
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
    restrict: translateRestrict(component),
    scope: translateParams(component),
    require: component.getRequire(),
    controller: ['$scope', '$attrs', ($scope, $attrs) => {
      $scope.$valent = getValentInfo(component);

      let name = component.getName();
      try {
        controller = initController($scope, $attrs, component);
      } catch (error) {
        throw new RuntimeException(name, 'component', error.message);
      }
    }],

    link: ($scope, element, attrs, require) => {
      link(null, $scope, element, attrs, require)
    }
  };

  let Controller = component.getController();

  if (isFunction(Controller.compile)) {
    configuration.compile = (element, attrs) => {
      let params = Controller.compile(element, attrs);

      return ($scope, element, attrs, require) => {
        link(params, $scope, element, attrs, require);
      }
    };
  }

  if (component.hasTemplate()) {

    // set template
    configuration.template = component.getTemplate();
  } else if (component.hasTemplateUrl()) {

    // set templateUrl
    configuration.templateUrl = component.getTemplateUrl();
  } else if (component.hasTemplateMethod()) {

    // set template using Components method
    configuration.template = (element, attrs) => {
      let method = component.getTemplateMethod();
      let template = method(element, attrs);

      if (!isString(template)) {
        let name = component.getName();
        throw new RuntimeException(name, 'component', 'result of Component.render() should be a string');
      }

      return template;
    }
  }

  return {
    name: component.getDirectiveName(),
    module,
    configuration
  }
}
