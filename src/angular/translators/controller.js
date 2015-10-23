import Logger from '../../utils/logger';
import Scope from '../services/scope';

let initController = ($scope, model, resolvers) => {

  let Controller = model.getController();

  let name = model.getName();
  var logger = Logger.create(name);

  let url = valent.url.get(name);
  let controller = new Controller(resolvers, url, logger);
  Scope.attach(controller, $scope);

  let namespace = model.getNamespace();
  $scope[namespace] = controller;

  $scope.$valent = getValentInfo(model);

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

  let dependencies = [];

  let localResolvers = model.getResolvers();
  let localDependencies = Object.keys(localResolvers);

  let globalResolvers = config.route.getResolvers();
  let globalDependencies = Object.keys(globalResolvers);

  let resolverKeys = globalDependencies.concat(localDependencies);
  if (!!resolverKeys.length) {
    dependencies.push('valentResolve');
  }

  let configuration = ['$scope', ...dependencies, ($scope, ...services) => {
    initController($scope, model, services);

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
