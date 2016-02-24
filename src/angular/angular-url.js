import isObject from 'lodash/lang/isObject';
import isEqual from 'lodash/lang/isEqual';
import cloneDeep from 'lodash/lang/cloneDeep';

import transform from 'lodash/object/transform';

import Url from '../url';

import Scope from './services/scope';
import Injector from './services/injector';

let _scope = Symbol('scope');
let _state = Symbol('state');

export default class AngularUrl extends Url {
  constructor(pattern, struct) {
    super(pattern, struct);

    this[_state] = {};
    this[_scope] = null;
  }

  // $scope is using for url.watch() method
  attachScope($scope) {
    this[_scope] = $scope;
  }

  hasScope() {
    return !!this[_scope];
  }

  parse() {
    let $location = Injector.get('$location');
    let decoded = this.decode($location.$$url);

    this.cacheParams(decoded);

    return decoded;
  }

  go(params, options) {
    let $location = Injector.get('$location');

    if (options) {
      let $rootScope = Injector.get('$rootScope');

      let unsubscribe = $rootScope.$on('$routeUpdate', event => {

        Object.assign(event, {
          $valentEvent: options
        });

        unsubscribe();
      });
    }

    let url = this.stringify(params);
    $location.url(url);
  }

  // TODO: fix this method
  redirect(params = {}) {
    if (!isObject(params)) {
      throw new Error('params should be an object');
    }

    let url = this.stringify(params);

    let isHtml5Mode = valent.config.get('routing.html5Mode');

    if(isHtml5Mode) {
      window.location.href = url;
    } else {
      window.location.href = `/#/${url}`;
    }
  }

  stringify(params) {
    let url = super.stringify(params);

    let $browser = Injector.get('$browser');
    let base = $browser.baseHref();

    return base ? url.replace(/^\//, '') : url;
  }

  watch(callback) {
    let $scope = this[_scope];

    this[_state] = this.parse();

    return $scope.$on('$routeUpdate', (event) => {
      let valentEvent = event.$valentEvent || {};

      let params = this.parse();

      // TODO: remove diff feature
      let diff = transform(params, (result, n, key) => {
        let state = this[_state][key];

        if (!isEqual(n, state)) {
          result[key] = n;
        }
      });

      this[_state] = cloneDeep(params);

      callback(params, diff, valentEvent);
    });
  }
}
