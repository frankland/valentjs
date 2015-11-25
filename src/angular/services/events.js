import Scope from './scope';

let _context = Symbol('context');

export default class Events {
  constructor(controller) {
    this[_context] = controller;
  }

  on(event, fn) {
    let context = this[_context];

    return Scope.get(context)
      .then($scope =>  $scope.$on(event, fn));
  }
}
