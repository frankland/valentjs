import isObject from 'lodash/lang/isPlainObject';

import Watcher from './watcher';


var local = {
  scope: Symbol('$scope'),
  definitions: Symbol('definitions'),
  watcher: Symbol('$watcher')
};


export default class DirectiveParams {
  constructor($scope, attrs) {
    this[local.scope] = $scope;
    this[local.definitions] = attrs;

    this[local.watcher] = new Watcher($scope);
  }

  isAvailable(key) {
    return this[local.definitions].indexOf(key) != -1 && key != 'pipes';
  }

  get(key) {
    if (!this.isAvailable(key)) {
      throw new Error(`Directive param "${key}" is not defined at directive config`);
    }

    return this[local.scope][key];
  }

  watch(key, cb) {
    if (!this.isAvailable(key)) {
      throw new Error(`Can not initialize watcher for "${key}" because this params is not defined at directive config`);
    }

    return this[local.watcher].watch(key, cb);
  }
}
