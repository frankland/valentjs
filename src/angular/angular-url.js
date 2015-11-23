import isObject from 'lodash/lang/isObject';
import isEqual from 'lodash/lang/isEqual';
import cloneDeep from 'lodash/lang/cloneDeep';

import transform from 'lodash/object/transform';

import Url from '../url';

import Scope from './services/scope';
import Injector from './services/injector';

let contexts = new WeakMap();
let queue = new WeakMap();

let _scope = Symbol('scope');
let _state = Symbol('state');


export default class AngularUrl extends Url {

  constructor(pattern, struct) {
    super(pattern, struct);

    this[_scope] = null;
    this[_state] = {};
  }

  attachScope($scope) {
    this[_scope] = $scope;
  }

  hasScope() {
    return !!this[_scope];
  }

  parse() {
    var $location = Injector.get('$location');
    return this.decode($location.$$url);
  }

  silent(params = {}) {
    let isChanged = this.isEqual(params);
    if (!isChanged) {
      let url = this.stringify(params);
      let $location = Injector.get('$location');
      let $rootScope = Injector.get('$rootScope');

      var unsubscribe = $rootScope.$on('$routeUpdate', (event) => {
        event.silent = true;
        unsubscribe();
      });

      $location.url(url)
    }

    return isChanged;
  }

  go(params, options) {
    let isChanged = this.isEqual(params);

    if (!isChanged) {
      let url = this.stringify(params);
      let $location = Injector.get('$location');

      $location.url(url)
    }

    return isChanged;
  }
  
  redirect(params = {}) {
    if (!isObject(params)) {
      throw new Error('params should be an object');
    }

    var url = this.stringify(params);
    var $window = Injector.get('$window');

    $window.location.href = url;
  }

  stringify(params) {
    var url = super.stringify(params);

    var $browser = Injector.get('$browser');
    var base = $browser.baseHref();

    return base ? url.replace(/^\//, '') : url;
  }

  watch(callback) {
    var context = this[_scope];

    Scope.get(context).then($scope => {
      $scope.$on('$routeUpdate', (event) => {
        if (!event.silent) {
          var params = this.parse();

          var diff = transform(params, (result, n, key) => {
            if (!isEqual(n, this[_state][key])) {
              result[key] = n;
            }
          });

          this[_state] = cloneDeep(params);

          callback(params, diff);
        }
      });
    });
  }
}
