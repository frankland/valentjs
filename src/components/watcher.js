import Scope from './scope';
import Injector from './injector';

var scope = Symbol('$scope');
var queue = Symbol('queue');


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
    this[queue] = new Set();

    if ($scope instanceof Promise) {
      $scope.then((angularScope) => {

        if (!isValidScope(angularScope)) {
          throw new Error('$scope for watcher is not valid');
        }

        this[scope] = angularScope;

        for (var task of this[queue]) {
          task.off = this[task.method].apply(this, task.arguments);
        }
      });
    } else {
      if (!isValidScope($scope)) {
        throw new Error('$scope for watcher is not valid');
      }

      this[scope] = $scope;
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

    if (this[scope]) {
      var $scope = this[scope];
      off = $scope.$watch.apply($scope, arguments);
    } else {
      var task = {
        method: 'watch',
        arguments: Array.prototype.slice.call(arguments)
      };

      this[queue].add(task);

      off = function() {
        if (this[scope]) {
          task.off();
        } else {
          this[queue].delete(task);
        }
      }
    }

    return off;
  }

  watchGroup() {
    var $scope = this[scope];
    return $scope.$watchGroup.apply($scope, arguments);
  }

  watchCollection() {
    var $scope = this[scope];
    return $scope.$watchCollection.apply($scope, arguments);
  }
}
