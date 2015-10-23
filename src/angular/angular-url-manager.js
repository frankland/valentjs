import UrlManager from '../url-manager';

let _contexts = Symbol('controller-contexts');
let _queue = Symbol('contexts-queue');

export default class AngularUrlManager extends UrlManager {
  constructor(options) {
    super(options);
    this[_contexts] = new WeakMap();
    this[_queue] = new Map();
  }

  attach($scope) {
    if (!$scope.hasOwnProperty('$valent')) {
      throw new Error('can not attach $scope because there is not $valent attribute');
    }

    let info = $scope.$valent;
    let namespace = info.namespace;
    let context = $scope[namespace];

    let name = info.name;

    this[_queue].set(name, $scope);
    this[_contexts].set(context, name);
  }

  detach($scope) {
    if (!$scope.hasOwnProperty('$valent')) {
      throw new Error('can not attach $scope because there is not $valent attribute');
    }

    let info = $scope.$valent;
    let namespace = info.namespace;
    let context = $scope[namespace];

    this[_contexts].delete(context);
  }


  get(name) {
    //if (!this[_queue].has(name)) {
    //  throw new Error(`can not get url "${name}" because there is no attached scope`);
    //}

    let url = super.get(name);

    if (!url.hasScope() && this[_queue].has(name)) {
      let $scope = this[_queue].get(name);
      url.attachScope($scope);

      this[_queue].delete(name);
    }

    return url;
  }

  create(context) {
    if (!this[_contexts].has(context)) {
      throw new Error(`can not get url by context. Seems $scope is not attached yet`);
    }

    let name = this[_contexts].get(context);

    return this.get(name);
  }
}
