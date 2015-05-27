import isFunction from 'lodash/lang/isFunction';


var config = {};

/**
 * Defaults
 */

config.resolve = {};
config.base = null;
config.otherwise = null;
config.html5Mode = true;
config.events = {

};

class RouteConfig {

  constructor() {

  }

  /**
   * Global resolve methods
   */
  addResolve(key, expr) {
    config.resolve[key] = expr;
  }

  getResolve() {
    return config.resolve;
  }

  /**
   * otherwise
   */
  setOtherwise(otherwise) {
    config.otherwise = otherwise;
  }

  getOtherwise() {
    return config.otherwise;
  }

  /**
   * Base url methods
   */
  setBase(base) {
    config.base = base;
  }

  hasBase() {
    return !!config.base;
  }

  getBase() {
    return config.base;
  }

  /**
   * Html5Mode methods
   */
  enableHtml5Mode() {
    config.html5Mode = true;
  }

  disableHtml5Mode() {
    config.html5Mode = false;
  }

  isHtml5Mode() {
    return !!config.html5Mode;
  }

  onRouteChangeError(fn) {
    if (!isFunction(fn)) {
      throw RouteException.routeChangeErrorIsNotFunction();
    }

    config.events.onRouteChnageError = fn;
  }

  getOnRouteChangeError() {
    return config.events.onRouteChnageError;
  }


  onRouteChangeStart(fn) {
    if (!isFunction(fn)) {
      throw RouteException.routeChangeErrorIsNotFunction();
    }

    config.events.onRouteChnageStart = fn;
  }

  getOnRouteChangeStart() {
    return config.events.onRouteChnageStart;
  }

}


export default new RouteConfig();
export { RouteConfig };
