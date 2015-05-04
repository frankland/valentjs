import Scope from './scope';
import Watcher from './watcher';

var params = new WeakMap();

var scope = Symbol('$scope');
var watcher = Symbol('$watcher');
var config = Symbol('$config');

export default class DirectiveParams {
  static create(context) {
    return Scope.get(context).then(($scope) => {
      return new DirectiveParams($scope, params.get($scope));
    });
  }

  static attach($scope, config) {
    params.set($scope, config);
  }

  static delete($scope) {
    params.delete($scope);
  }

  constructor($scope, definitions) {
    this[scope] = $scope;
    this[config] = definitions;
    this[watcher] = new Watcher($scope);
  }

  isAvailable(key) {
    return Object.keys(this[config]).indexOf(key) != -1
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
      throw new Error(`Can not initialize watcher for "${key}" because this params is not defined at directive config`);
    }

    return this[watcher].watch(key, cb);
  }
}
