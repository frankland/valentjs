import Scope from './scope';

var privateScope = Symbol('$scope');

/**
 * TODO: auto add "controller" to watch conditions
 */
export default class Watcher {
  static create(context) {
    return Scope.get(context).then((scope) => {
      return new Watcher(scope);
    });
  }

  constructor(scope) {
    this[privateScope] = scope;
  }

  watch() {
    var scope = this[privateScope];
    return scope.$watch.apply(scope, arguments);
  }

  watchGroup() {
    var scope = this[privateScope];
    return scope.$watchGroup.apply(scope, arguments);
  }

  watchCollection() {
    var scope = this[privateScope];
    return scope.$watchCollection.apply(scope, arguments);
  }
}
