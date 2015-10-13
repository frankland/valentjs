import camelCase from 'lodash/string/camelCase';


let translateRestrict = (component) => {
  let restrict = 'E';

  if (component.withoutTemplate()) {
    restrict = 'A';
  }

  return restrict;
};

let translateParams = (component) => {
  let params = component.getParams();

  if (component.isIsolated()) {

    let interfaces = component.getInterfaces();
    let optionals = component.getOptionals();

    for (let key of Object.keys(interfaces)) {
      if (optionals.hasOwnProperty(key)) {
        throw new Error('optionals and interfaces could not have same keys');
      }
    }

    Object.assign(params, interfaces, optionals);
  }

  return params;
};

export default (component) => {
  let name = component.getName();
  let module = component.getModule();

  let controller = null;
  let Controller = component.getController();

  let link = (params, $scope, element, attrs, require) => {
    if (controller.link) {
      if (params) {
        controller.link(params, element, attrs, $scope);
      } else {
        controller.link(element, attrs, $scope);
      }

      // GC
      controller = null;
    }
  };

  let configuration = {
    replace: false,
    restrict: translateRestrict(component),
    scope: translateParams(component),
    controller: ['$scope', '$attrs', ($scope, $attrs) => {
      let interfaces = component.getInterfaces();
      let instances = [];

      for (let key of Object.keys(interfaces)) {
        let interfaceInstance = $scope[key];

        if (!interfaceInstance) {
          throw new Error(`directive should implements interface "${key}"`);
        }

        let InterfaceClass = interfaces[key];

        if (!(interfaceInstance instanceof  InterfaceClass)) {
          throw new Error(`interface "${key}" has wrong class`);
        }

        instances.push($scope[key]);
      }

      let optionals = component.getOptionals();
      for (let key of Object.keys(optionals)) {
        let interfaceInstance = $scope[key];
        if (interfaceInstance) {

          let InterfaceClass = optionals[key];

          if (!(interfaceInstance instanceof  InterfaceClass)) {
            throw new Error(`interface "${key}" has wrong class`);
          }

          instances.push($scope[key]);
        }
      }

      let namespace = component.getNamespace();
      let params = {};
      $scope[namespace] = new Controller(...instances, params);

      // Allow GC collect already uneeded variable
      Controller = null;

      controller = $scope[namespace];
    }],

    link: ($scope, element, attrs, require) => {
      link(null, $scope, element, attrs, require)
    }
  };

  if (Controller.compile) {
    configuration.compile = (element, attrs) => {
      let params = Controller.compile(element, attrs);

      return ($scope, element, attrs, require) => {
        link(params, $scope, element, attrs, require);
      }
    };
  }

  if (component.hasTemplate())  {

    // set template
    configuration.template = component.getTemplate();
  } else if (component.hasTemplateUrl()) {

    // set templateUrl
    configuration.templateUrl = component.getTemplateUrl();
  } else if (component.hasTemplateMethod()) {

    // set template using Components method
    configuration.template = (element, attrs) => {
      let method = component.getTemplateMethod();
      return  method(element, attrs);
    }
  }

  return {
    name,
    module,
    configuration
  }
}
