import isObject from 'lodash/lang/isPlainObject';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';

import camelCase from 'lodash/string/camelCase';

import DirectiveException from './directive-exception'

function setDefaults(config) {
  config.dependencies = [];
  config.pipes = {};
  config.scope = null;
  config.replace = true;
  config.restrict = null;
}

var availableRestricts = ['A', 'E', 'C'];

var local = {
  config: Symbol('config')
};

export default class DirectiveModel {
  constructor(name) {
    if (!name) {
      throw new Error('Directive name should be described');
    }

    this[local.config] = {};
    this[local.config].name = camelCase(name);
    this[local.config].controllerName = `<${name}>`;

    setDefaults(this[local.config]);

    this.exception = new DirectiveException(this[local.config].controllerName);
  }

  getName() {
    return this[local.config].name;
  }

  getControllerName() {
    return this[local.config].controllerName;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    this[local.config].application = name;
  }

  getApplicationName() {
    return this[local.config].application;
  }

  /**
   *
   * @param require
   */
  require(require) {
    if (!isArray(require)) {
      this[local.config].require = [require];
    } else {
      this[local.config].require = require;
    }
  }

  hasRequire() {
    return !!this[local.config].require;
  }

  getRequire() {
    return this[local.config].require;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    if (!isArray(dependencies)) {
      throw this.exception.dependenciesAreNotArray();
    }

    for (var dependency of dependencies) {
      this.addDependency(dependency);
    }
  }

  addDependency(dependency) {
    if (!isString(dependency)) {
      throw this.exception.dependencyIsNotString();
    }

    this[local.config].dependencies.push(dependency);
  }

  getDependencies() {
    return this[local.config].dependencies;
  }

  /**
   *
   * @param transclude
   */
  setTransclude(transclude) {
    this[local.config].transclude = !!transclude;
  }

  getTransclude() {
    return this[local.config].transclude;
  }

  /**
   * no setter because
   * https://github.com/angular/angular.js/commit/eec6394a342fb92fba5270eee11c83f1d895e9fb#commitcomment-8124407
   * @returns {*}
   */
  getReplace() {
    return this[local.config].replace;
  }

  /**
   * Set directive's attributes
   * @param scope
   */
  setScope(scope) {
    if (!isObject(scope)) {
      throw this.exception.wrongScopeFormat();
    }

    this[local.config].scope = scope;
  }

  getScope() {
    return this[local.config].scope;
  }

  /**
   * Set directive's restrict
   * @param restrict
   */
  setRestrict(restrict) {
    if (!isString(restrict)) {
      throw this.exception.wrongRestrictOption()
    }

    var splitted = restrict.split('');
    for (var char of splitted) {
      if (availableRestricts.indexOf(char) == -1) {
        throw this.exception.wrongRestrictOption()
      }
    }

    this[local.config].restrict = restrict;
  }

  getRestrict() {
    return this[local.config].restrict;
  }

  /**
   * Set directive's controller class
   * @param controller
   */
  setController(controller) {
    this[local.config].controller = controller;
  }

  getController() {
    return this[local.config].controller;
  }

  /**
   * Set directive's pipes
   * @param pipes
   */
  setPipes(pipes) {
    if (!isObject(pipes)) {
      throw this.exception.wrongPipesFormat();
    }

    this[local.config].pipes = pipes;
  }

  getPipes() {
    return this[local.config].pipes;
  }

  hasPipes() {
    return !!this[local.config].pipes;
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
}
