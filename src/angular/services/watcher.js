import Scope from './scope';
import Injector from './injector';

let _scope = Symbol('$scope');
let _queue = Symbol('queue');


/**
 * https://github.com/angular/angular.js/blob/f7b999703f4f3bdaea035ce692f1a656b0c1a933/src/Angular.js#L632
 * @param angularScope
 * @returns {*}
 */
function isValidScope(angularScope) {
  return angularScope && angularScope.$evalAsync && angularScope.$watch;
}

/**
 * TODO: auto add "controller" to watch conditions
 * TODO: setScope and exceptions
 */
export default class Watcher {
  constructor($scope) {
    this[_queue] = new Set();

    if ($scope instanceof Promise) {
      $scope.then((angularScope) => {

        if (!isValidScope(angularScope)) {
          throw new Error('$scope for watcher is not valid');
        }

        this[_scope] = angularScope;

        for (let task of this[_queue]) {
          task.off = this[task.method].apply(this, task.arguments);
        }
      });
    } else {
      if (!isValidScope($scope)) {
        throw new Error('$scope for watcher is not valid');
      }

      this[_scope] = $scope;
    }
  }

  static create(context) {
    let scope = null;

    if (context) {
      scope = Scope.get(context);
    } else {
      scope = Injector.get('$rootScope');
    }

    return new Watcher(scope);
  }

  watch() {
    let off = null;

    if (this[_scope]) {
      let $scope = this[_scope];
      off = $scope.$watch.apply($scope, arguments);
    } else {
      let task = {
        method: 'watch',
        arguments: Array.prototype.slice.call(arguments)
      };

      this[_queue].add(task);

      off = function() {
        if (this[_scope]) {
          task.off();
        } else {
          this[_queue].delete(task);
        }
      }
    }

    return off;
  }
}
