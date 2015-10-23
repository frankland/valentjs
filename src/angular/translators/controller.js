import Logger from '../../utils/logger';
import Scope from '../services/scope';

import RuntimeException from '../../exceptions/runtime';

let initController = ($scope, model, valentResolve) => {

  let Controller = model.getController();

  let name = model.getName();
  var logger = Logger.create(name);

  let url = valent.url.get(name);
  let controller = new Controller(valentResolve, url, logger);
  Scope.attach(controller, $scope);

  let namespace = model.getNamespace();
  $scope[namespace] = controller;

  // $scope events
  $scope.$on('$destroy', () => {
    if (isFunction(controller.destructor)) {
      controller.destructor();
    }
  });

  return $scope[namespace];
};

let getValentInfo = (model) => {

  return {
    type: 'controller',
    name: model.getName(),
    namespace: model.getNamespace()
  };
};

export default (model, config) => {
  let name = model.getName();
  let module = model.getModule();

  let configuration = ['$scope', 'valentResolve', ($scope, valentResolve) => {
    $scope.$valent = getValentInfo(model);

    try {
      initController($scope, model, valentResolve);
    } catch (error) {
      throw new RuntimeException(name, 'controller', error.message);
    }

    // attach $scope to url. needs for url.watch and get url by context. useful at parent classes
    valent.url.attach($scope);

    $scope.$on('$destory', () => {
      valent.url.detach($scope);
    });
  }];

  return {
    name,
    module,
    configuration
  }
}
