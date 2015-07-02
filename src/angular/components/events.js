import Scope from './scope';

var local = {
  context: Symbol('context')
};

export default class Events {
  constructor(controller) {
    this[local.context] = controller;
  }

  on(event, fn) {
    Scope.get(this[local.context])
      .then(($scope) => {
        return $scope.$on(event, fn);
      });
  }
}
