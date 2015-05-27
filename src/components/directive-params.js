import isObject from 'lodash/lang/isPlainObject';

import Watcher from './watcher';

var scope = Symbol('$scope');
var definitions = Symbol('definitions');

var watcher = Symbol('$watcher');

export default class DirectiveParams {
  constructor($scope, attrs) {
    this[scope] = $scope;
    this[definitions] = attrs;

    this[watcher] = new Watcher($scope);
  }

  isAvailable(key) {
    return this[definitions].indexOf(key) != -1
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
