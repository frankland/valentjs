import isObject from 'lodash/lang/isObject'

import Url from '../../components/url';

import Scope from './scope';
import Injector from './injector';
import Diggest from './diggest';

var contexts = new WeakMap();
var queue = new WeakMap();

var local = {
  context: Symbol('context')
};


export default class AngularUrl extends Url {

  /**
   * Associate controller's name with controller's context (URL scope)
   * @param namespace
   * @param context
   */
  static attach(namespace, context) {
    if (!Url.has(namespace)) {
      throw new Error(`Can not attach context. Url struct for "${namespace}" does not defined`);
    }

    var url = Url.get(namespace);
    url.attach(context);

    contexts.set(context, url);

    if (queue.has(context)) {
      var resolve = queue.get(context);
      resolve(url);

      queue.delete(context);
    }
  }

  static isAttached(context) {
    return contexts.has(context);
  }

  static create(context) {
    if (!isObject(context)) {
      throw new Error(`Wrong arguments for AngularUrl.get`);
    }

    return new Promise((resolve, reject) => {
      if (AngularUrl.isAttached(context)) {
        var url = contexts.get(context);
        resolve(url);

      } else {
        queue.set(context, resolve);
      }
    });
  }


  attach(context) {
    this[local.context] = context;
  }

  go(params) {
    var url = this.stringify(params);

    var $location = Injector.get('$location');
    $location.url(url);
  }

  redirect() {
    var url = this.encode(params);
    var $window = Injector.get('$window');

    $window.location.href = url;
  }

  watch(cb) {
    var context = this[local.context];

    Scope.get(context).then($scope => {
      $scope.$on('$routeUpdate', () => {
        var params = this.parse();

        cb(params);
      });
    });
  }
}
