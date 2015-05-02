import Scope from './scope';

var params = new WeakMap();
var scope = Symbol('$scope');

export default class DirectiveParams {
  static create(context) {
    return Scope.get(context).then((scope) => {
      return new DirectiveParams(scope);
    });
  }

  static attach($scope, config) {
    params.set($scope, config);
  }

  constructor($scope) {
    this[scope] = $scope;
  }

  get(key) {
    return this[scope][key];
  }
}
