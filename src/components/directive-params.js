import Scope from './scope';
import Watcher from './watcher';

var params = new WeakMap();

var scope = Symbol('$scope');
var watcher = Symbol('$watcher');

export default class DirectiveParams {
  static create(context) {
    return Scope.get(context).then(($scope) => {
      return new DirectiveParams($scope);
    });
  }

  static attach($scope, config) {
    params.set($scope, config);
  }

  constructor($scope) {
    this[scope] = $scope;
    this[watcher] = new Watcher($scope);
  }

  isAvailable(key) {
    var config = params.get(this[scope]);

    return Object.keys(config).indexOf(key) != -1
      && key != 'pipes';
  }

  get(key) {
    if (!this.isAvailable(key)) {
      throw new Error(`Directive param "${key}" is not defined at directive config`);
    }

    return this[scope][key];
  }

  watch(key, cb) {
    if (!this.isAvailable(key)) {
      throw new Error(`Can not initialize watcher for "${key}" becase this params is not defined at directive config`);
    }

    return this[watcher].watch(key, cb);
  }
}
