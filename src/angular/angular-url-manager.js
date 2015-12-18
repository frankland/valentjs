import UrlManager from '../url-manager';
import Injector from './services/injector';

let _contexts = Symbol('controller-contexts');
let _queue = Symbol('contexts-queue');

export default class AngularUrlManager extends UrlManager {
  constructor() {
    super();
    this[_contexts] = new WeakMap();
    this[_queue] = new Map();
  }

  attach(name, context, $scope) {
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
    let url = super.get(name);

    if (!url.hasScope() && this[_queue].has(name)) {
      let $scope = this[_queue].get(name);

      if (!$scope) {
        // NOTES: seems this case is impossible
        throw new Error('there is not scope to attach to angular url');
      }

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

  reload() {
    let $route = Injector.get('$route');
    $route.reload();
  }

  getCurrentRoute() {
    let $route = Injector.get('$route');

    let url = null;
    if ($route.hasOwnProperty('current') && $route.current.$$route) {
      url = this.get($route.current.$$route.controller);
    }

    return url;
  }
}
