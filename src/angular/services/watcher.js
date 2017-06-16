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

export default class Watcher {
  constructor(context) {
    this[_queue] = new Set();

    if (context) {
      // TODO: remove context dep. Work only with valid scopes
      if (isValidScope(context)) {
        this[_scope] = context;
      } else {
        Scope.get(context).then($scope => {
          this[_scope] = $scope;

          for (let task of this[_queue]) {
            task.off = this.watch(...task.arguments);
          }
        });
      }
    } else {
      this[_scope] = Injector.get('$rootScope');
    }
  }

  watch() {
    let off = null;

    if (this[_scope]) {
      let $scope = this[_scope];
      off = $scope.$watch.apply($scope, arguments);
    } else {
      let task = {
        arguments: Array.prototype.slice.call(arguments),
      };

      this[_queue].add(task);

      off = () => {
        if (this[_scope]) {
          task.off();
        } else {
          this[_queue].delete(task);
        }
      };
    }

    return off;
  }
}
