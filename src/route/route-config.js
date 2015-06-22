import isFunction from 'lodash/lang/isFunction';
import RouteException from './route-exception';

/**
 * Defaults
 */
var local = {
  config: Symbol('config')
};

function setDefaults(config) {
  config.resolve = {};
  config.base = null;
  config.otherwise = null;
  config.html5Mode = true;
  config.events = {};
}

class RouteConfig {

  constructor() {
    this[local.config] = {};

    setDefaults(this[local.config]);
    this.exception = new RouteException('global.route.config');
  }

  /**
   * Global resolve methods
   */
  addResolver(key, value) {
    if (!isFunction(value) && !isString(key)) {
      throw this.exception.wrongAddResolverArguments();
    }

    this[local.config].resolve[key] = value;
  }

  setResolvers(resolvers) {
    this[local.config].resolvers = {};

    if (!isObject(resolvers)) {
      throw this.exception.wrongSetResolversArguments();
    }

    for (var key of Object.keys(resolvers)) {
      this.addResolver(key, resolvers[key]);
    }
  }

  getResolvers() {
    return this[local.config].resolve;
  }

  /**
   * otherwise
   */
  setOtherwise(otherwise) {
    this[local.config].otherwise = otherwise;
  }

  getOtherwise() {
    return this[local.config].otherwise;
  }

  /**
   * Base url methods
   */
  setBase(base) {
    this[local.config].base = base;
  }

  hasBase() {
    return !!this[local.config].base;
  }

  getBase() {
    return this[local.config].base;
  }

  /**
   * Html5Mode methods
   */
  enableHtml5Mode() {
    this[local.config].html5Mode = true;
  }

  disableHtml5Mode() {
    this[local.config].html5Mode = false;
  }

  isHtml5Mode() {
    return !!this[local.config].html5Mode;
  }

  onRouteChangeError(fn) {
    if (!isFunction(fn)) {
      throw RouteException.routeChangeErrorIsNotFunction();
    }

    this[local.config].events.onRouteChnageError = fn;
  }

  getOnRouteChangeError() {
    return this[local.config].events.onRouteChnageError;
  }


  onRouteChangeStart(fn) {
    if (!isFunction(fn)) {
      throw RouteException.routeChangeErrorIsNotFunction();
    }

    this[local.config].events.onRouteChnageStart = fn;
  }

  getOnRouteChangeStart() {
    return this[local.config].events.onRouteChnageStart;
  }
}


export default new RouteConfig();
export { RouteConfig };
