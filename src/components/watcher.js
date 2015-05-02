import Scope from './scope';

var scope = Symbol('$scope');

/**
 * TODO: auto add "controller" to watch conditions
 */
export default class Watcher {
  static create(context) {
    return Scope.get(context).then(($scope) => {
      return new Watcher($scope);
    });
  }

  constructor($scope) {
    this[scope] = $scope;
  }

  watch() {
    var $scope = this[scope];
    return $scope.$watch.apply($scope, arguments);
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
