import UrlManager from '../url-manager';

let _contexts = Symbol('controller-contexts');

export default class AngularUrlManager extends UrlManager {
  constructor(options) {
    super(options);
    this[_contexts] = new WeakMap();
  }

  attach($scope) {
    if (!$scope.hasOwnProperty('$valentInfo')) {
      throw new Error('can not attach $scope because there is not $valentInfo attribute');
    }

    let info = $scope.valentInfo;
    let namespace = info.namespace;
    let context = $scope[namespace];

    let name = info.name;
    let url = this.get(name);
    url.attachScope($scope);

    this[_contexts].set(context, url);
  }

  detach($scope) {
    if (!$scope.hasOwnProperty('$valentInfo')) {
      throw new Error('can not attach $scope because there is not $valentInfo attribute');
    }

    let info = $scope.valentInfo;
    let namespace = info.namespace;
    let context = $scope[namespace];

    this[_contexts].delete(context);
  }

  create(context) {
    return this[_contexts].get(context);
  }
}
