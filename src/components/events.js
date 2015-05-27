import Scope from './scope';

var context = Symbol('context');

export default class Events {
  constructor(controller) {
    this[context] = controller;
  }

  on(event, fn) {
    Scope.get(this[context])
      .then(($scope) => {
        $scope.$on(event, fn);
      })
  }
}
