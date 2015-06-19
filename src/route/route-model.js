import isFunction from 'lodash/lang/isFunction';
import isString from 'lodash/lang/isString';
import isObject from 'lodash/lang/isObject';

import RouteException from './route-exception';

function setDefaults(config) {
  config.urls = [];
  config.caseInsensitiveMatch = true;
  config.reloadOnSearch = false;
  config.resolve = {};
  config.options = {};
}

var local = {
  config: Symbol('config')
};

export default class RouteModel {
  constructor(name) {
    if (!name) {
      throw new Error('Controller name should be passed to Route constructor');
    }

    this[local.config] = {};
    this[local.config].controller = name;

    setDefaults(this[local.config]);

    this.exception = new RouteException(name);
  }

  getControllerName() {
    return this[local.config].controller;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    this[local.config].application = name;
  }

  hasApplication() {
    return this[local.config].application;
  }

  getApplicationName() {
    return this[local.config].application;
  }

  /**
   * Add url
   * @param url
   */
  addUrl(url) {
    this[local.config].urls.push(url);
  }

  getUrls() {
    return this[local.config].urls;
  }

  /**
   *
   * @param template
   */
  setTemplate(template) {
    if (this[local.config].templateUrl) {
      throw this.exception.templateUrlAlreadyExists();
    }

    if (!isString(template) && !isFunction(template)) {
      throw this.exception.wrongTemplate();
    }

    this[local.config].template = template;
  }

  getTemplate() {
    return this[local.config].template;
  }

  /**
   *
   * @param templateUrl
   */
  setTemplateUrl(templateUrl) {
    if (this[local.config].template) {
      throw this.exception.templateAlreadyExists();
    }

    if (!isString(templateUrl)) {
      throw this.exception.wrongTemplateUrl();
    }

    this[local.config].templateUrl = templateUrl;
  }

  getTemplateUrl() {
    return this[local.config].templateUrl;
  }

  /**
   *
   */
  addResolve(key, value) {
    if (!isFunction(value)) {
      throw this.exception.wrongResolveArguments();
    }

    this[local.config].resolve[key] = value;
  }

  setResolve() {
    this[local.config].resolve = {};

    var resolve = null;
    if (arguments.length == 1 && isObject(arguments[0])) {
      resolve = arguments[0];
    } else if (arguments.length == 2 && !isObject(arguments[0])) {
      resolve = {
        [arguments[0]]: arguments[1]
      }
    } else {
      throw this.exception.wrongResolveArguments();
    }

    for (var key of Object.keys(resolve)) {
      this.addResolve(key, resolve[key]);
    }
  }

  getResolve() {
    return this[local.config].resolve;
  }

  /**
   * Check if at least of one url was attached
   * @returns {boolean}
   */
  hasUrl() {
    return !!this.urls.length;
  }

  setUrlBuilder(urlBuilder) {
    this[local.config].urlBuilder = urlBuilder;
  }

  hasUrlBuilder() {
    return !!this[local.config].urlBuilder || this[local.config].urls.length == 1;
  }

  /**
   * Get url builder :D
   * @returns {function}
   */
  getUrlBuilder() {
    return this[local.config].urlBuilder ? this[local.config].urlBuilder : this[local.config].urls[0];
  }

  addOption(key, value) {
    this[local.config].options[key] = value;
  }

  setOptions() {
    this[local.config].options[key] = {};

    var options = null;
    if (arguments.length == 1 && isObject(arguments[0])) {
      options = arguments[0];
    } else if (arguments.length == 2 && !isObject(arguments[0])) {
      options = {
        [arguments[0]]: arguments[1]
      }
    } else {
      throw this.exception.wrongOptionsArguments();
    }

    for (var option of Object.keys(options)) {
      this.addOption(option, options[option]);
    }
  }

  getOption(key) {
    return this[local.config].options[key];
  }

  setReloadOnSearch(reloadOnSearch) {
    this[local.config].reloadOnSearch = !!reloadOnSearch;
  }

  getReloadOnSearch() {
    return this[local.config].reloadOnSearch;
  }
}
