import debounce from 'lodash/function/debounce';

import Scope from './scope';
import Injector from './injector';

function safe(scope, fn) {
  if (scope.$root === null) {
    return;
  }

  let phase = scope.$root.$$phase;
  if (phase == '$apply' || phase == '$digest') {
    if (angular.isFunction(fn)) {
      fn();
    }
  } else {
    scope.$apply(fn);
  }
}

let digest = (context, fn) => {
  if (context) {
    if (Scope.has(context)) {
      Scope.get(context).then((scope) => {
        safe(scope, fn);
      });
    }
  } else {
    let scope = Injector.get('$rootScope');
    safe(scope, fn);
  }
};

/**
 * TODO: add possibility to configure debounce options
 */
const timeout = 50;

const options = {
  leading: false,
  trailing: true
};

export default debounce(digest, timeout, options);
