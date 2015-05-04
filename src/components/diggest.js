import Scope from './scope';
import Injector from './injector';

function safe(scope, fn) {
  if (scope.$root === null) {
    return;
  }

  var phase = scope.$root.$$phase;
  if(phase == '$apply' || phase == '$digest') {
    if(angular.isFunction(fn)) {
      fn();
    }
  } else {
    scope.$apply(fn);
  }
}

export default class Diggest {
  static run(context, fn = () => {}) {
    if (context) {
      if (Scope.has(context)) {
        Scope.get(context).then((scope) => {
          safe(scope, fn);
        });
      }
    } else {
      var scope = Injector.get('$rootScope');
      safe(scope, fn);
    }
  }
}
