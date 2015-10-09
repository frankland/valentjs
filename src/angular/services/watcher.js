import Scope from './scope';
import Injector from './injector';

var local = {
  scope: Symbol('$scope'),
  queue: Symbol('queue')
};


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
    this[local.queue] = new Set();

    if ($scope instanceof Promise) {
      $scope.then((angularScope) => {

        if (!isValidScope(angularScope)) {
          throw new Error('$scope for watcher is not valid');
        }

        this[local.scope] = angularScope;

        for (var task of this[local.queue]) {
          task.off = this[task.method].apply(this, task.arguments);
        }
      });
    } else {
      if (!isValidScope($scope)) {
        throw new Error('$scope for watcher is not valid');
      }

      this[local.scope] = $scope;
    }
  }

  static create(context) {
    var scope = null;

    if (context) {
      scope = Scope.get(context);
    } else {
      scope = Injector.get('$rootScope');
    }

    return new Watcher(scope);
  }

  watch() {
    var off = null;

    if (this[local.scope]) {
      var $scope = this[local.scope];
      off = $scope.$watch.apply($scope, arguments);
    } else {
      var task = {
        method: 'watch',
        arguments: Array.prototype.slice.call(arguments)
      };

      this[local.queue].add(task);

      off = function() {
        if (this[local.scope]) {
          task.off();
        } else {
          this[local.queue].delete(task);
        }
      }
    }

    return off;
  }

  watchGroup() {
    var $scope = this[local.scope];
    return $scope.$watchGroup.apply($scope, arguments);
  }

  watchCollection() {
    var $scope = this[local.scope];
    return $scope.$watchCollection.apply($scope, arguments);
  }
}
