import debounce from 'lodash/debounce';

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
      Scope.get(context).then(scope => {
        safe(scope, fn);
      });
    }
  } else {
    let scope = Injector.get('$rootScope');
    safe(scope, fn);
  }
};

const DEBOUNCE_TIMEOUT = 50;

const DEBOUNCE_CONFIG = {
  leading: false,
  trailing: true,
};

let timeout = valent.config.get('angular.digest.timeout', DEBOUNCE_TIMEOUT);
let debounced = debounce(digest, timeout, DEBOUNCE_CONFIG);

debounced.configure = timeout => {
  return debounce(digest, timeout, DEBOUNCE_CONFIG);
};

export default debounced;
