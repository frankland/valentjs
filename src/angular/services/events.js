import Scope from './scope';

let _context = Symbol('context');

export default class Events {
  constructor(controller) {
    this[_context] = controller;
  }

  on(event, fn) {
    let context = this[_context];

    let off = null;

    Scope.get(context)
      .then($scope => {
        if (!off) {
          off =$scope.$on(event, fn)
        }
      });

    return () => {
      if (off) {
        off();
      } else {
        off = true;
      }
    };
  }

  broadcast(event, args) {
    let context = this[_context];

    Scope.get(context)
      .then($scope => $scope.$broadcast(event, args));
  }

  emit(event, args) {
    let context = this[_context];
    
    Scope.get(context)
      .then($scope => $scope.$emit(event, args));
  }
}
