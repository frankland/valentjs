import isFunction from 'lodash/lang/isFunction';

import Logger from '../../utils/logger';
import Scope from '../services/scope';


let initController = ($scope, controllerModel, valentResolve) => {

  let Controller = controllerModel.getController();

  let name = controllerModel.getName();
  let logger = Logger.create(name);

  let args = [];
  if (valentResolve) {
    args.push(valentResolve);
  }

  if (valent.url.has(name)) {
    // attach scope to AngularUrl to allow use watch() method
    let url = valent.url.get(name);
    url.attachScope($scope);

    args.push(url);
  }

  args.push(logger);

  let controller = new Controller(...args);
  Scope.attach(controller, $scope);

  let namespace = controllerModel.getNamespace();
  $scope[namespace] = controller;

  // $scope events
  $scope.$on('$destroy', () => {
    if (isFunction(controller.destructor)) {
      controller.destructor();
    }
  });

  return $scope[namespace];
};

let getValentInfo = (controllerModel) => {
  return {
    type: 'controller',
    name: controllerModel.getName(),
    namespace: controllerModel.getNamespace()
  };
};

export default (controllerModel, config) => {
  let name = controllerModel.getName();
  let module = controllerModel.getModule();

  let configuration = ['$scope', 'valent.resolve', ($scope, valentResolve) => {
    $scope.$valent = getValentInfo(controllerModel);

    initController($scope, controllerModel, valentResolve);

    // attach $scope to url. needs for url.watch and get url by context. useful at parent classes
    valent.url.attach($scope);

    $scope.$on('$destroy', () => {
      valent.url.detach($scope);
    });
  }];

  return {
    name,
    module,
    configuration
  }
}
