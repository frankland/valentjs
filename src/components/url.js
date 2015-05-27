import isFunction from 'lodash/lang/isFunction';
import isString from 'lodash/lang/isString';
import isObject from 'lodash/lang/isPlainObject';

import RouteConfig from '../route/route-config';

class UrlManager {
  constructor() {
    this.routes = new Map();
  }

  /**
   * Default Url Builder. Serialize params object to url query
   * @param url
   * @param params {object}
   * @returns {string}
   */
  static build(url, params) {
    if (params && !isObject(params)) {
      throw new Error('Wrong arguments for url builder. @params should be an object');
    }

    /**
     * TODO: parse URL ? and * symbols
     */
    var parts = [];
    if (params) {
      for (var param of Object.keys(params)) {
        var value = params[param];
        var placeholder = `:${param}`;

        if (url.indexOf(placeholder) == -1) {
          var part = `${param}=${encodeURIComponent(value)}`;
          parts.push(part);
        } else {
          url = url.replace(placeholder, value);
        }
      }
    }

    var query = parts.join('&');

    return query.length == 0 ? url : [url, query].join('?');
  }

  static at(url) {
    return (params) => {
      return UrlManager.build(url, params);
    }
  }

  add(namespace, expr) {
    if (!isFunction(expr) && !isString(expr)) {
      throw new Error(`Url builder for '${namespace}' should function or string`);
    }

    this.routes.set(namespace, expr);
  }

  get(route) {
    if (!this.routes.has(route)) {
      throw new Error(`Url builder for controller "${route}" does not exist`);
    }

    var expr = this.routes.get(route);

    var builder = null;
    if (isFunction(expr)) {
      builder = expr;
    } else if (isString(expr)) {
      builder = UrlManager.at(expr);
    }

    var base = RouteConfig.getBase() || '';

    return function() {
      var result = builder.apply(null, arguments);
      var url = null;

      if (isObject(result)) {
        var query = result.query;
        url = UrlManager.build(result.url, query);
      } else if (isString(result)) {
        url = result;
      } else {
        throw new Error('Url builder output type should be an object {url, query} or string');
      }

      return base + url
    };
  }
}


export default new UrlManager();
export { UrlManager };
